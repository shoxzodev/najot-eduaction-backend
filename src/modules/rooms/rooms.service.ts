import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateRoomDto } from './dto/create.dto';
import { UpdateRoomDto } from './dto/update.dto';
import { Status } from '@prisma/client';

@Injectable()
export class RoomsService {
    constructor(private prisma : PrismaService){}

    async getAllRooms(){
        const rooms = await this.prisma.room.findMany({
            where:{status:Status.active}
        })

        return {
            success : true,
            data:rooms
        }
    }

    async getArchiveRooms(){
        const rooms = await this.prisma.room.findMany({
            where:{status:Status.inactive}
        })

        return {
            success : true,
            data:rooms
        }
    }

    async getOneRoom(id: number) {
        const room = await this.prisma.room.findUnique({
            where: { id }
        });

        if (!room) {
            throw new NotFoundException("Room not found");
        }

        return {
            success: true,
            data: room
        };
    }

    async createRoom(payload : CreateRoomDto){

        const existRoom = await this.prisma.room.findUnique({
            where:{name:payload.name}
        })

        if(existRoom) {
            throw new ConflictException("Room already exists")
        }

        await this.prisma.room.create({
            data:payload
        })

        return {
            success : true,
            message : "Room created"
        }
    }

    async deleteRoom(id:number){
        const existRoom = await this.prisma.room.findUnique({
            where:{id}
        })

        if(!existRoom) {
            throw new ConflictException("Room not found")
        }

        await this.prisma.room.update({
            where:{id},
            data:{status:Status.inactive}
        })

        return {
            success : true,
            message : "Room deleted"
        }
    }

    async updateRoom(id: number, payload: UpdateRoomDto) {
        const existRoom = await this.prisma.room.findUnique({
            where: { id }
        });

        if (!existRoom) {
            throw new NotFoundException("Room not found");
        }

        if (payload.name) {
            const nameExist = await this.prisma.room.findUnique({
                where: { name: payload.name }
            });
            if (nameExist && nameExist.id !== id) {
                throw new ConflictException("Room name already exists");
            }
        }

        await this.prisma.room.update({
            where: { id },
            data: payload
        });

        return {
            success: true,
            message: "Room updated"
        };
    }
}
