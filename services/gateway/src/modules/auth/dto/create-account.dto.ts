import { ApiProperty } from "@nestjs/swagger";
export class CreateAccountDTO {
    @ApiProperty()
    email: string;
    @ApiProperty()
    username: string
    @ApiProperty({ required: false })
    password?: string;
    @ApiProperty({ required: false })
    auth0_id?: string;
}