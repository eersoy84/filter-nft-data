import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { models } from '@worldwidewebb/tsoa-shared';
import { CollectionToken } from '../models/collectionTokens';

@Injectable()
export class OpenseaService {
  private openseaClient: any;
  private readonly logger = new Logger(OpenseaService.name);

  constructor() {
    this.openseaClient = axios.create({
      baseURL: process.env.OPENSEA_API_URL,
      timeout: 5000,
    });
    this.logger.verbose('Initializing Opensea...');
    axiosRetry(this.openseaClient, { retries: 3, retryDelay: () => 500 });
  }

  async fetchNftOpensea(chain: string, address: string, token_id: string): Promise<CollectionToken | null> {
    if (chain != 'eth') throw new models.NotFoundError();
    let nftData: any = {};
    this.logger.log(`Fetching metadata ${address} #${token_id} from OpenSea`);

    try {
      const { data } = await this.openseaClient.get(
        `/api/v1/assets?asset_contract_address=${address}&token_ids=${token_id}`,
        {
          headers: {
            'X-API-KEY': process.env.OPENSEA_API_KEY || '',
          },
        },
      );

      let asset = data.assets[0];

      nftData = {
        collection: {
          address: {
            value: address,
            chain,
          },
          collectionName: asset.asset_contract.name,
          symbol: asset.asset_contract.symbol,
          openseaSlug: asset.collection.slug,
        },
        token: {
          id: asset.token_id,
          url: asset.permalink,
          amount: 0,
          metadata: JSON.stringify({
            traits: asset.traits,
            description: asset.collection.description,
          }),
        },
      };
    } catch (err) {
      console.warn(`Error while fetching metadata for asset ${address} #${token_id} from OpenSea`, err);
      return null;
    }

    return nftData;
  }
}
