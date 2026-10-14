import { WeekDay } from "@prisma/client";
export declare class CreateGroupDto {
    name: string;
    description: string;
    course_id: number;
    teachers?: number[];
    students?: number[];
    room_id: number;
    start_date: string;
    week_day: WeekDay[];
    start_time: string;
    max_student: number;
}
