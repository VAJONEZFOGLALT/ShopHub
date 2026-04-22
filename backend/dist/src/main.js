"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const origins = [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:5174',
    ].filter((origin) => Boolean(origin));
    app.enableCors({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map