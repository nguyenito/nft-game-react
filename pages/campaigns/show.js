import React, { Component } from 'react';
import { Card, Grid, GridColumn, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

let imageList = [
  'https://react.semantic-ui.com/images/avatar/large/matthew.png',
  'https://react.semantic-ui.com/images/avatar/large/christian.jpg',
  'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
  'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
  'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
  'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
  'https://react.semantic-ui.com/images/avatar/large/rachel.png',
  'https://react.semantic-ui.com/images/avatar/large/helen.jpg',
  'https://react.semantic-ui.com/images/avatar/large/stevie.jpg',
  'https://react.semantic-ui.com/images/avatar/large/tom.jpg',
  'https://react.semantic-ui.com/images/avatar/large/matt.jpg',
  'https://react.semantic-ui.com/images/avatar/large/ade.jpg',
  'https://react.semantic-ui.com/images/avatar/large/joe.jpg',
  'https://react.semantic-ui.com/images/avatar/large/justen.jpg',
  'https://react.semantic-ui.com/images/avatar/large/laura.jpg',
  'https://react.semantic-ui.com/images/avatar/large/veronika.jpg',
];

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const t1 = performance.now();

    const campaign = Campaign(props.query.address);
    const imgIndex = Math.floor(Math.random() * imageList.length);

    const summary = await campaign.methods.getSummary().call();

    const t2 = performance.now();

    console.log('Campaign getSummary() took ' + (t2 - t1) + ' ms');
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      campaignName: summary[5],
      campaignDescription: summary[6],
      avatar: imageList[imgIndex],
    };

    // return {
    //   address: props.query.address,
    //   minimumContribution: 1,
    //   balance: '100',
    //   requestsCount: 3,
    //   approversCount: 4,
    //   manager: 'Nguyen',
    //   avatar: imageList[imgIndex],
    // };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      campaignName,
      campaignDescription,
      avatar,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
        image: avatar,
      },
      {
        header: campaignName,
        meta: 'Project Details',
        description: campaignDescription,
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an approver',
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers',
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description:
          'Number of people who have already donated to this campaign',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend',
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaigns Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button color="green">View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
