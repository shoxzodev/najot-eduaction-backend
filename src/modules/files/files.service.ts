import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class FilesService {
    constructor(private prisma : PrismaService) { }

    async getFiles(groupId : number) {
        const group = await this.prisma.group.findUnique({
            where : {
                id : groupId
            }
        })

        if(!group){
            throw new BadRequestException("Group not found")
        }

        const videos = await this.prisma.lessonVideo.findMany({
            where : {
                group_id : groupId
            },
           select:{
            id : true,
            video_url : true,
            originalname : true,    
            size_mb : true,
            created_at : true,
            lesson : {
                select:{
                    id : true,
                    topic : true,
                    created_at : true
                }
            }
           }
        })

        return videos
    }

    async uploadFile(groupId : number,lessonId : number, file : Express.Multer.File) {
        const group = await this.prisma.group.findUnique({
            where : {
                id : groupId
            }
        })

        if(!group){
            throw new BadRequestException("Group not found")
        }

        const lesson = await this.prisma.lesson.findUnique({
            where : {
                id : lessonId
            }
        })

        if(!lesson){
            throw new BadRequestException("Lesson not found")
        } 

        await this.prisma.lessonVideo.create({
            data : {
                lesson_id : lessonId,
                group_id : groupId, 
                video_url : file.filename, 
                originalname : file.originalname,
                size_mb : file.size / 1024 / 1024 
            }
        })

        return { 
            success : true, 
            message : "File uploaded successfully"
        }
    }
}
