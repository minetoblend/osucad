import {connect} from 'mongoose';

export default async function () {
    return await connect(`mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}/${process.env.MONGO_DATABASE}`);
}

