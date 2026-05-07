import { Permission } from '../../permissions/entities/permission.entity';
import { UserRole } from "../../common/enum/user.role.enun";
export declare class Role {
    id: string;
    name: UserRole;
    permission: Permission;
}
