import web3 from './web3';
import Campaign from './build/Campaign.json';

const CampaignClass = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

export default CampaignClass;

// const campaign = Campaign(this.props.address);
// const accounts = await web3.eth.getAccounts();

// await campaign.methods.approveRequest(this.props.id).send({
//   from: accounts[0],
// });
