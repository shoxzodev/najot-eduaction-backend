import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateGroupDto } from './dto/create.dto';
import { Status } from '@prisma/client';
import { filterDto } from './dto/search';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) { }

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

}
