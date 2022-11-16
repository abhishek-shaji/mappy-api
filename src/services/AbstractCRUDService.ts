import { Model } from 'mongoose';

abstract class AbstractCRUDService {
  protected constructor(private readonly model: Model<any>, private formatModel: (...props: any) => any) {}

  findAll = async () => {
    const list = await this.model.find({});

    return list.map((item: any) => this.formatModel(item));
  };

  findOne = async (_id: string, shouldFormat = true) => {
    const item = await this.model.findOne({ _id });

    if (shouldFormat) {
      return this.formatModel(item);
    }

    return item;
  };

  create = async (data: any) => {
    const item = new this.model(data);

    await item.save();

    return this.formatModel(item);
  };

  update = async (_id: string, data: any) => {
    const item = await this.model.findOneAndUpdate({ _id }, { $set: data }, { new: true });

    return this.formatModel(item);
  };

  delete = async (_id: string) => {
    await this.model.findOneAndRemove({ _id });

    return {success: true};
  };
}

export { AbstractCRUDService };
