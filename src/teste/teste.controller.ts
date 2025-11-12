import { Controller, Get, Ip, Param } from '@nestjs/common';

@Controller('teste')
export class TesteController {
    @Get(':name')
    try(@Param() params) :string {
        return `Funcionando ${params.name}`;
    }
}
