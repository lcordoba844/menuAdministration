import { type Request, type Response } from 'express';
import { OfficeService } from './office.services';
import { error } from 'node:console';

export class OfficeController {
    private officeService = new OfficeService();

    public getOffices = async (req: Request, res: Response): Promise<void> => {
        try {
            const offices = await this.officeService.getAllOffices();
            
            res.status(200).json({
                status: 'success',
                data: offices
            });
        } catch (error) {
            console.error('Error fetching offices:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    };

    public createOffice = async (req: Request, res: Response): Promise<void> => {
        try {
            const newOffice = await this.officeService.createOffice(req.body);
            
            res.status(201).json({
                status: 'success',
                data: newOffice
            });
        } catch (error) {
            console.error('Error creating office:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    };

    public updateOffice = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const updatedOffice = await this.officeService.updateOffice(id, req.body);
            
            res.status(200).json({
                status: 'success',
                data: updatedOffice
            });
        } catch (error: any) {
            if (error.message === 'OFFICE_NOT_FOUND') {
                res.status(404).json({ status: 'error', message: 'Office not found' });
                return;
            }
            console.error('Error updating office:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    };

    public deleteOffice = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            
            await this.officeService.deleteOffice(id);
            
            res.status(204).send(); 
        } catch (error: any) {
            if (error.message === 'OFFICE_NOT_FOUND') {
                res.status(404).json({ status: 'error', message: 'Office not found' });
                return;
            }
            console.error('Error deleting office:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    };
}