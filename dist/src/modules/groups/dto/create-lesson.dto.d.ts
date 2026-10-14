export declare class AttendanceItemDto {
    student_id: number;
}
export declare class CreateLessonDto {
    topic: string;
    description?: string;
    lesson_date: string;
    attendances: AttendanceItemDto[];
}
