import { IsInt, IsNotEmpty, IsIn } from 'class-validator';

export class CreateVoteDto {
    @IsInt()
    @IsNotEmpty()
    @IsIn([1, -1])
    value: number;
}
