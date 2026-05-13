import Office from '../../models/Office';
import { CreateOfficeDto, UpdateOfficeDto } from './office.dto';

export class OfficeService {
    
    public async getAllOffices(): Promise<Office[]> {
        return await Office.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    public async createOffice(data: CreateOfficeDto): Promise<Office> {
        return await Office.create({ ...data });
    }

    public async updateOffice(id: string, data: UpdateOfficeDto): Promise<Office> {
        const office = await Office.findByPk(id);
        
        if (!office) {
            throw new Error('OFFICE_NOT_FOUND');
        }

        return await office.update(data);
    }

    public async deleteOffice(id: string): Promise<void> {
        const office = await Office.findByPk(id);
        
        if (!office) {
            throw new Error('OFFICE_NOT_FOUND');
        }

        await office.destroy(); 
    }
}