import joiToSwagger, { SwaggerSchema } from 'joi-to-swagger';
import { JsonObject } from 'swagger-ui-express';
import { Route } from '../route';
import { ObjectSchema } from 'joi';

interface SwaggerParameter {
  name: string;
  in: string;
  required: boolean;
  schema: SwaggerSchema;
}

type Location = 'header' | 'query' | 'path';

const convertToSwaggerParameters = (schema: ObjectSchema, location: Location): SwaggerParameter[] => {
  const { swagger } = joiToSwagger(schema);
  return Object.entries(swagger.properties).map(([name, prop]) => ({
    name,
    in: location,
    required: (swagger.required || []).includes(name),
    schema: prop,
  }));
};

export const buildOpenApiSpec = (routes: Route[]): Object => {
  const paths: Object = {};

  for (const route of routes) {
    const swaggerParameters: SwaggerParameter[] = [];
    const requestSchema = route.schema;

    if (requestSchema?.headers) {
      const headersParameters = convertToSwaggerParameters(requestSchema.headers, 'header');
      swaggerParameters.push(...headersParameters);
    }

    if (requestSchema?.query) {
      const queryParameters = convertToSwaggerParameters(requestSchema.query, 'query');
      swaggerParameters.push(...queryParameters);
    }

    if (requestSchema?.params) {
      const pathParameters = convertToSwaggerParameters(requestSchema.params, 'path');
      swaggerParameters.push(...pathParameters);
    }

    const bodySchema = requestSchema?.body;
    const swaggerBodySchema = bodySchema ? joiToSwagger(bodySchema).swagger : undefined;

    const path = route.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    if (!paths[path]) {
      paths[path] = {};
    }

    const responses = route.responses || {
      200: { description: 'Success' },
    };

    paths[path][route.method] = {
      summary: route.summary,
      tags: [route.tag ?? 'default'],
      security: route.auth ? [{ bearerAuth: [] }] : undefined,
      parameters: swaggerParameters.length > 0 ? swaggerParameters : undefined,
      requestBody: swaggerBodySchema && {
        content: {
          'application/json': {
            schema: swaggerBodySchema,
          },
        },
      },
      responses,
    };
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Favorites API',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [],
    paths,
  };
};
