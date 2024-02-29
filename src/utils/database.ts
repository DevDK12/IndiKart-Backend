import mongoose from "mongoose";





export const pingDB = ()=>{
    const readyState = mongoose.connection.readyState;

    if (readyState === 1 || readyState === 2) {
        console.log('DB is connected');
    } else {
        console.log('DB is not connected');
    }
}





const mongoConnect = async (url: string, server: () => void) => {

    try {
        await mongoose.connect(url, {
            dbName: 'Ecommerce_DB',
        });

        pingDB();

        console.log(`DB connected to ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);

        server();
    }
    catch (err) {
        console.log('Connection to Mongodb failed')
    }

}


export default mongoConnect;