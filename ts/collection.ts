import { MongoClient } from "./client.ts";
import { CommandType } from "./types.ts";
import { dispatchAsync, encode } from "./util.ts";

export class Collection {
  constructor(
    private readonly client: MongoClient,
    private readonly dbName: string,
    private readonly collectionName: string
  ) {}

  private async _find(filter?: Object, findOne: boolean = false): Promise<any> {
    const doc = await dispatchAsync(
      {
        command_type: CommandType.Find,
        client_id: this.client.clientId
      },
      encode(
        JSON.stringify({
          dbName: this.dbName,
          collectionName: this.collectionName,
          filter,
          findOne
        })
      )
    );
    return doc;
  }

  public async findOne(filter?: Object): Promise<any> {
    return this._find(filter, true);
  }

  public async find(filter?: Object): Promise<any> {
    return this._find(filter, false);
  }

  public async insertOne(doc: Object): Promise<any> {
    const _id = await dispatchAsync(
      {
        command_type: CommandType.InsertOne,
        client_id: this.client.clientId
      },
      encode(
        JSON.stringify({
          dbName: this.dbName,
          collectionName: this.collectionName,
          doc
        })
      )
    );
    return _id;
  }

  public async insertMany(docs: Object[]): Promise<any> {
    const _ids = await dispatchAsync(
      {
        command_type: CommandType.InsertMany,
        client_id: this.client.clientId
      },
      encode(
        JSON.stringify({
          dbName: this.dbName,
          collectionName: this.collectionName,
          docs
        })
      )
    );
    return _ids;
  }

  private async _delete(
    query: Object,
    deleteOne: boolean = false
  ): Promise<number> {
    const deleteCount = await dispatchAsync(
      {
        command_type: CommandType.Delete,
        client_id: this.client.clientId
      },
      encode(
        JSON.stringify({
          dbName: this.dbName,
          collectionName: this.collectionName,
          query,
          deleteOne
        })
      )
    );
    return deleteCount as number;
  }

  public deleteOne(query: Object): Promise<number> {
    return this._delete(query, true);
  }

  public deleteMany(query: Object): Promise<number> {
    return this._delete(query, false);
  }
}
