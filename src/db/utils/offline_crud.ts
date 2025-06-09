import { eq } from "drizzle-orm";

export async function upsertData(trx:any, table:any, data:any) {
    for (const item of data) {
        const isExist = await trx.select().from(table).where(eq(table.id, item.id));
        
        if (isExist.length > 0) {
            await trx.update(table).set(item).where(eq(table.id, item.id));
        } else {
            await trx.insert(table).values(item);
        }
    }
}

export async function upsertIndividualData(trx:any, table:any, data:any){
    const isExist = await trx.select().from(table).where(eq(table.id, data.id));
    
    if (isExist.length > 0) {
        await trx.update(table).set(data).where(eq(table.id, data.id));
    } else {
        await trx.insert(table).values(data);
    }
}