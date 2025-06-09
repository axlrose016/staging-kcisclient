export interface IAttachments {
    id: string;
    record_id: string;
    file_id: number;
    file_name: string;
    file_path: Blob | string | null;
    file_type: string,
    module_path: string;
    user_id: string;
    created_date: string,            
    created_by: string,              
    last_modified_date: string | null, 
    last_modified_by: string | null,  
    push_status_id: number,     
    push_date: string | null,              
    deleted_date: string | null,      
    deleted_by: string | null,        
    is_deleted: boolean,             
    remarks: string | null,  
}

