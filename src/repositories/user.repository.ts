import { UserModel, IUser } from "../models/user.models";

export interface IUserRepository {
   
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    
    createUser(user: Partial<IUser>): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    getAll(): Promise<IUser[]>;
    getAdmins(): Promise<IUser[]>;
    getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }>;
    update(id:string,user:Partial<IUser>):Promise<IUser | null>;
    delete(id: string):Promise<boolean>;
}
export class UserMongoRepository implements IUserRepository {  
    async getUserById(id: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ _id: id });
        return found;
    }
    async getUserByEmail(email: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ email });
        return found;
    }
    async getUserByUsername(username: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ username });
        return found;
    }
    async createUser(user: Partial<IUser>): Promise<IUser> {
        const created = await UserModel.create(user);
        return created;
    }

   async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        const updated = await UserModel.findByIdAndUpdate(id, user, { new: true });
        return updated;
    }
    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id);
        return !!deleted;
    }
     async getAll(): Promise<IUser[]> {
        const found = await UserModel.find();
        return found;
    }
     async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }> {
        const query: any = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const total = await UserModel.countDocuments(query);
        const data = await UserModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { data, total };
    }
    async getAdmins(){

    return await UserModel.find({
        role:"admin"
    });

}

}