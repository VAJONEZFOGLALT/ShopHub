import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private isConnected;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
