import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateGroupDto } from './dto/create.dto';
import { UpdateGroupDto } from './dto/update.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { HomeworkStatus, Status } from '@prisma/client';
import { filterDto } from './dto/search';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) { }

    async getLessonsByGroupId(groupId: number, studentId: number) {
        const existsStudent = await this.prisma.studentGroup.findFirst({
            where:{
                group_id:groupId,
                student_id:studentId
            }
        })

        if(!existsStudent){
            throw new NotFoundException("Group not found with this id")
        }

        const lessons = await this.prisma.lesson.findMany({
            where:{
                group_id:groupId 
            },
            select:{
                id:true,
                topic:true,
                created_at:true,
                _count:{
                    select:{
                        lessonVideos:true
                    }
                }, 
                homework:{
                    select:{
                        id:true,
                    } 
                }  
            },
            orderBy:{
                created_at:'desc'
            } 
        })

        let lessonsFormated = lessons.map(lesson => {
            return {
                id:lesson.id,
                topic:lesson.topic,
                created_at:lesson.created_at, 
                homeworkId:lesson.homework[0]?.id ? lesson.homework[0].id : null,
                videoCount:lesson._count.lessonVideos || 0
            }
        })

        return lessonsFormated
    }

    async getLessons(groupId: number, studentId: number) {
        const existGroup = await this.prisma.studentGroup.findFirst({
            where: {
                group_id: groupId,
                student_id: studentId
            }
        })

        if (!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        let lessons : any = await this.prisma.lesson.findMany({
            where:{
                group_id: groupId
            },
            select:{
                id:true,
                topic:true,
                created_at:true,

                _count:{ 
                    select:{
                        lessonVideos:true
                    }
                },
                
                homework:{ 
                    select:{
                        id:true,
                        lesson_id:true,  
                        homeworkAnswerStudents:{
                            select:{
                                homeworkStatus:true, 
                                homeworkResults:{
                                    select:{
                                        homeworkStatus:true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy:{
                created_at:'desc'
            }
        })

        lessons = lessons.map(lesson => {   
            if(lesson.homework.length === 0){
                return {
                    ...lesson,
                    status:"Berilmagan"
                }
            }else if(lesson.homework[0]?.homeworkAnswerStudents[0]?.homeworkStatus == HomeworkStatus.PENDING){
                return {
                    ...lesson,
                    status:"Kutilmoqda" 
                }
            }else if(lesson.homework[0]?.homeworkAnswerStudents[0]?.homeworkResults[0]?.homeworkStatus == HomeworkStatus.ACCEPTED){
                return {
                    ...lesson,
                    status:"Qabul qilingan" 
                }
            }else if(lesson.homework[0]?.homeworkAnswerStudents[0]?.homeworkResults[0]?.homeworkStatus == HomeworkStatus.REJECTED){
                return {
                    ...lesson,
                    status:"Qaytarilgan" 
                }
            }else{
                return {
                    ...lesson,
                    status: "Bajarilmagan" 
                }
            }
        }) 

        const lessonFormated = lessons.map(lesson=>({
            id: lesson?.id,
            topic: lesson?.topic, 
            created_at:lesson?.created_at,
            status:lesson?.status, 
            videoCount:lesson?._count?.lessonVideos,
        }))
        return lessonFormated 

    } 

    async getGroupOne(groupId: number) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: Status.active
            }
        })

        if (!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        const groupStudents = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
                status: Status.active
            },
            select: {
                students: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        email: true,
                        photo: true,
                        birth_date: true,
                        created_at: true
                    }
                }
            }
        })

        const dataFormatter = groupStudents.map(el => el.students)

        return {
            success: true,
            data: dataFormatter
        }
    }

    async getArchiveGroups() {
        const groups = await this.prisma.group.findMany({
            where: {
                status: Status.inactive
            },
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                courses: {
                    select: {
                        id: true,
                        name: true,
                        duration_month: true
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                created_at: true
            }
        })

        return {
            success: true,
            data: groups
        }
    }

    async getAllGroups(search: filterDto) {
        const { groupName, max_student } = search
        let searchWhere = {
            status: Status.active,
        }

        if (groupName) {
            searchWhere["name"] = groupName
        }
        if (max_student) {
            searchWhere["max_student"] = +max_student
        }

        const groups = await this.prisma.group.findMany({
            where: searchWhere,
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                courses: {
                    select: {
                        id: true,
                        name: true,
                        duration_month: true
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                GroupTeacher: {
                    select: {
                        Teacher: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        }
                    }
                },
                studentGroups: {
                    select: {
                        students: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        }
                    }
                }
            }
        })

        const dataFormatter = groups.map((el) => ({
            id: el.id,
            name: el.name,
            start_date: el.start_date,
            start_time: el.start_time,
            week_day: el.week_day,
            course: {
                name: el.courses.name,
                duration_month: el.courses.duration_month,
            }, 
            room: el.rooms.name,
            teachers: el.GroupTeacher.map(gt => ({
                id: gt.Teacher.id,
                full_name: gt.Teacher.full_name
            })),
            student_count: el.studentGroups.length,
            students: el.studentGroups.map(sg => sg.students)
        }));

        return {
            success: true,
            data: dataFormatter
        }
    }

    async getOneGroup(id: number) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                max_student: true,
                start_date: true,
                start_time: true,
                week_day: true,
                courses: {
                    select: {
                        id: true,
                        name: true,
                        duration_month: true
                    }
                },
                rooms: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                GroupTeacher: {
                    select: {
                        Teacher: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        }
                    }
                },
                studentGroups: {
                    select: {
                        students: {
                            select: {
                                id: true,
                                full_name: true
                            }
                        }
                    }
                }
            }
        });

        if (!group) {
            throw new NotFoundException("Group not found");
        }

        const dataFormatter = {
            id: group.id,
            name: group.name,
            start_date: group.start_date,
            start_time: group.start_time,
            week_day: group.week_day,
            course: {
                name: group.courses.name,
                duration_month: group.courses.duration_month,
            },
            room: group.rooms.name,
            teachers: group.GroupTeacher.map(gt => ({
                id: gt.Teacher.id,
                full_name: gt.Teacher.full_name
            })),
            student_count: group.studentGroups.length,
            students: group.studentGroups.map(sg => sg.students)
        };

        return {
            success: true,
            data: dataFormatter
        };
    }

    async getGroupById(groupId: number) {
        const existGroup = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: Status.active
            }
        })

        if (!existGroup) {
            throw new NotFoundException("Group not found with this id")
        }

        const groupStudentsCount = await this.prisma.studentGroup.count({
            where: {
                group_id: groupId,
                status: Status.active
            },

        })

        const students = await this.prisma.studentGroup.findMany({
            where: {
                group_id: groupId,
                status: Status.active,
            },
            select: {
                students: {
                    select: {
                        birth_date: true,
                    },
                },
            },
        });

        const now = new Date();

        const ages = students
            .filter((item) => item.students?.birth_date)
            .map((item) => {
                const birthDate = new Date(item.students.birth_date);

                let age = now.getFullYear() - birthDate.getFullYear();

                const monthDiff = now.getMonth() - birthDate.getMonth();

                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 &&
                        now.getDate() < birthDate.getDate())
                ) {
                    age--;
                }

                return age;
            });

        const averageAge =
            ages.length > 0
                ? Math.round(
                    ages.reduce((sum, age) => sum + age, 0) / ages.length
                )
                : 0;


        const groupTeachers = await this.prisma.groupTeacher.findMany({
            where: {
                group_id: groupId,
            },
            select: {
                Teacher: {
                    select: {
                        id: true,
                        full_name: true,
                        photo: true
                    }
                }
            }
        })

        const groupCourse = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: Status.active
            },
            select: {
                courses: {
                    select: {
                        id: true, 
                        name: true,
                        duration_month:true
                    }
                }
            }
        })

        const groupRoom = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                status: Status.active
            },
            select: {
                rooms: {
                    select: {
                        id: true,
                        capacity:true
                    }
                }
            }
        })

        const dataFormatter = {
            student_count: groupStudentsCount,
            teachers: groupTeachers.map(gt => gt.Teacher),
            averageAge: averageAge,
            course: groupCourse?.courses, 
            room_capacity: groupRoom?.rooms?.capacity,

        }

        return {
            success: true,
            data: dataFormatter
        }
    }

    async createGroup(payload: CreateGroupDto) {

        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(":").map(Number);
            return h * 60 + m;
        };

        const existRoom = await this.prisma.room.findFirst({
            where: {
                id: payload.room_id,
                status: Status.active
            }
        });

        if (!existRoom) {
            throw new NotFoundException("Room is not found with this id");
        }

        const existCourse = await this.prisma.course.findFirst({
            where: {
                id: payload.course_id,
                status: Status.active
            }
        });

        if (!existCourse) {
            throw new NotFoundException("Course is not found or inactive with this id");
        }



        const existGroup = await this.prisma.group.findUnique({
            where: { name: payload.name }
        });

        if (existGroup) {
            throw new ConflictException("Group already exists");
        }

        const startNew = timeToMinutes(payload.start_time);
        const endNew = startNew + existCourse.duration_hours * 60;

        const roomGroups = await this.prisma.group.findMany({
            where: {
                room_id: payload.room_id,
                status: Status.active
            },
            select: {
                start_time: true,
                courses: {
                    select: {
                        duration_hours: true
                    }
                }
            }
        });

        const isRoomBusy = roomGroups.some(el => {
            const start = timeToMinutes(el.start_time);
            const end = start + el.courses.duration_hours * 60;

            return start < endNew && end > startNew;
        });

        if (isRoomBusy) {
            throw new ConflictException("Room is busy at this time");
        }

        const { teachers, students, ...groupData } = payload;

        const existingTeachers = await this.prisma.teacher.findMany({
            where: {
                id: {
                    in: teachers
                }
            }
        })

        const existingStudents = await this.prisma.student.findMany({
            where: {
                id: {
                    in: students
                }
            }
        })

        if (existingTeachers.length != teachers?.length) {
            throw new NotFoundException("Teacher is not found with this id")
        }

        if (existingStudents?.length != students?.length) {
            throw new NotFoundException("Student is not found with this id")
        }

        const newGroup = await this.prisma.group.create({
            data: {
                ...groupData,
                start_date: new Date(payload.start_date),
                GroupTeacher: teachers?.length ? {
                    create: teachers?.map(id => ({ teacher_id: id }))
                } : undefined,
                studentGroups: students?.length ? {
                    create: students?.map(id => ({ student_id: id }))
                } : undefined
            }
        });

        return {
            success: true,
            message: "Group created successfully",
            data: newGroup
        };
    }

    async getSchedules(groupId: number) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { courses: true }
        });

        if (!group) {
            throw new NotFoundException("Group not found");
        }

        const weekDayMap = {
            'SUNDAY': 0,
            'MONDAY': 1,
            'TUESDAY': 2,
            'WEDNESDAY': 3,
            'THURSDAY': 4,
            'FRIDAY': 5,
            'SATURDAY': 6
        };

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const { start_date, week_day, courses } = group;
        const duration = courses.duration_month;
        const targetWeekDays = week_day.map(wd => weekDayMap[wd]);

        // Fetch completed lesson dates by created_at field
        const completedLessons = await this.prisma.lesson.findMany({
            where: {
                group_id: groupId,
            },
            select: {
                created_at: true
            }
        });

        const completedDates = new Set(
            completedLessons.map(l => l.created_at.toISOString().split('T')[0])
        );

        const schedules = {};
        const now = new Date();
        let currentDate = new Date(start_date);

        for (let i = 1; i <= duration; i++) {
            const monthDates = [] as { day: number; month: string; isCompleted: boolean }[];
            const monthStart = new Date(currentDate);
            const endOfPeriod = new Date(currentDate);
            endOfPeriod.setMonth(endOfPeriod.getMonth() + 1);

            // A month is active if current date falls within its range
            const isActive = now >= monthStart && now < endOfPeriod;

            while (currentDate < endOfPeriod) {
                if (targetWeekDays.includes(currentDate.getDay())) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    monthDates.push({
                        day: currentDate.getDate(),
                        month: monthNames[currentDate.getMonth()],
                        isCompleted: completedDates.has(dateStr)
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            schedules[i] = {
                isActive,
                days: monthDates
            };
        }

        return [schedules];
    }

    async createLesson(groupId: number, payload: CreateLessonDto) {
        const existGroup = await this.prisma.group.findFirst({
            where: { id: groupId, status: Status.active }
        });
        if (!existGroup) {
            throw new NotFoundException('Group not found');
        }

        // Duplicate lesson for same date check (using range for created_at)
        const date = new Date(payload.lesson_date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const existLesson = await this.prisma.lesson.findFirst({
            where: {
                group_id: groupId,
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
        if (existLesson) {
            throw new ConflictException('Lesson already exists for this date');
        }

        const lesson = await this.prisma.lesson.create({
            data: {
                group_id: groupId,
                topic: payload.topic,
                description: payload.description,
                created_at: startOfDay
            }
        });

        // Create Attendance records separately linked to group
        if (payload.attendances?.length) {
            await this.prisma.attendance.createMany({
                data: payload.attendances.map(a => ({
                    group_id: groupId,
                    student_id: a.student_id,
                    isPresent: true,
                    created_at: startOfDay
                }))
            });
        }

        return {
            success: true,
            message: 'Lesson and attendance created successfully',
            data: lesson
        };
    }

    async getLessonByDate(groupId: number, dateStr: string) {
        const date = new Date(dateStr);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const lesson = await this.prisma.lesson.findFirst({
            where: {
                group_id: groupId,
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        const attendances = await this.prisma.attendance.findMany({
            where: {
                group_id: groupId,
                created_at: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                students: {
                    select: { id: true, full_name: true, photo: true }
                }
            }
        });

        // All students in group
        const groupStudents = await this.prisma.studentGroup.findMany({
            where: { group_id: groupId, status: Status.active },
            select: {
                students: {
                    select: { id: true, full_name: true, photo: true }
                }
            }
        });

        const students = groupStudents.map(sg => sg.students);
        const presentIds = new Set(
            attendances.map(a => a.student_id)
        );

        const attendanceList = students.map(s => ({
            student_id: s.id,
            full_name: s.full_name,
            photo: s.photo,
            isPresent: presentIds.has(s.id)
        }));

        return {
            success: true,
            data: {
                lesson: lesson ? {
                    id: lesson.id,
                    topic: lesson.topic,
                    description: lesson.description,
                    created_at: lesson.created_at
                } : null,
                attendance: attendanceList
            }
        };
    }

    async deleteGroup(id:number){
        const existGroup = await this.prisma.group.findUnique({
            where:{
                id,
                status:Status.active
            }
        })

        if(!existGroup){
            throw new NotFoundException("Group not found")
        }

        await this.prisma.group.update({
            where:{
                id
            },
            data:{
                status:Status.inactive
            }
        })

        return {
            success:true,
            message:"Group deleted"
        }
    }

    async updateGroup(id: number, payload: UpdateGroupDto) {
        const existGroup = await this.prisma.group.findUnique({
            where: { id }
        });

        if (!existGroup) {
            throw new NotFoundException("Group not found");
        }

        if (payload.name) {
            const nameExist = await this.prisma.group.findUnique({
                where: { name: payload.name }
            });
            if (nameExist && nameExist.id !== id) {
                throw new ConflictException("Group name already exists");
            }
        }

        const { teachers, students, ...groupData } = payload;

        if (teachers !== undefined) {
            const existingTeachers = await this.prisma.teacher.findMany({
                where: { id: { in: teachers } }
            });

            if (existingTeachers.length !== teachers?.length) {
                throw new NotFoundException("Teacher is not found");
            }
            
            await this.prisma.groupTeacher.deleteMany({
                where: { group_id: id }
            });
        }

        if (students !== undefined) {
            const existingStudents = await this.prisma.student.findMany({
                where: { id: { in: students } }
            });

            if (existingStudents.length !== students?.length) {
                throw new NotFoundException("Student is not found");
            }
            
            await this.prisma.studentGroup.deleteMany({
                where: { group_id: id }
            });
        }

        await this.prisma.group.update({
            where: { id },
            data: {
                ...groupData,
                ...(payload.start_date && { start_date: new Date(payload.start_date) }),
                ...(teachers !== undefined && {
                    GroupTeacher: teachers?.length ? {
                        create: teachers?.map(tId => ({ teacher_id: tId }))
                    } : undefined
                }),
                ...(students !== undefined && {
                    studentGroups: students?.length ? {
                        create: students?.map(sId => ({ student_id: sId }))
                    } : undefined
                })
            }
        });

        return {
            success: true,
            message: "Group updated"
        };
    }
}
