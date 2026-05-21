import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.dto';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService : RoomsService){}

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllRooms(){
        return this.roomService.getAllRooms()
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN) 
    @Get("arxive")
    getArchiveRooms(){
        return this.roomService.getArchiveRooms()
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post()
    createRoom(@Body() payload: CreateRoomDto){
        return this.roomService.createRoom(payload)
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete("/:id")
    deleteRoom(@Param("id", ParseIntPipe) id: number){
        return this.roomService.deleteRoom(id)
    }
}
