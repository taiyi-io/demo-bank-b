import ChainProvider from '../components/chain_provider';
import { ChainConnector } from "@taiyi-io/chain-connector";
import { AccountStatus, AssetProperties, ASSET_SCHEMA_NAME } from '../components/customer_asset';
import Boot from './bootstrap';

async function ensureSchema(conn: ChainConnector) {
  let hasSchema = await conn.hasSchema(ASSET_SCHEMA_NAME);
  if (!hasSchema) {
    let defines = AssetProperties;
    await conn.createSchema(ASSET_SCHEMA_NAME, defines);
    console.log('schema %s initialized', ASSET_SCHEMA_NAME);
  }
  {
    interface initialData{
      asset: number,
      cash_flow: number,
      status: number,
      register_time: string,
    };
    let customers: Map<string, initialData> = new Map([
      ['wang_xiaoer', {
        asset: 250000,
        cash_flow: 60000,
        status: AccountStatus.Normal,
        register_time: new Date('2021-10-05 13:00:50').toISOString(),
      }],
      ['zhangsan', {
        asset: 1350000,
        cash_flow: 6530000,
        status: AccountStatus.Normal,
        register_time: new Date('2016-07-25 16:01:20').toISOString(),
      }],
      ['lisi', {
        asset: 5000,
        cash_flow: 120000,
        status: AccountStatus.Alert,
        register_time: new Date('2021-01-15 19:00:50').toISOString(),
      }],
      ['laoliu', {
        asset: 410000,
        cash_flow: 930000,
        status: AccountStatus.Suspend,
        register_time: new Date('2020-10-07 13:00:50').toISOString(),
      }],
    ]);
    for(let [user, data] of customers){
      let exists = await conn.hasDocument(ASSET_SCHEMA_NAME, user)
      if (!exists){
        await conn.addDocument(ASSET_SCHEMA_NAME, user, JSON.stringify(data));
        console.log('sample customer %s added', user);
      }
      
    }
  }
}

export const dynamic = 'force-dynamic',
  revalidate = 0,
  fetchCache = 'force-no-store';

export default async function RootLayout({ children }) {
  let conn = await ChainProvider.connect();
  await ensureSchema(conn);

  return (
    <html>
      <body>
        <Boot />
        {children}
      </body>
    </html>
  )
}
