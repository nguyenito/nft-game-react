import React, { Component } from 'react';
import { Form, Button, Input, Message, Icon } from 'semantic-ui-react';
import { message } from 'antd';
import 'antd/dist/antd.css';

import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import token from '../../ethereum/Token';

class CampaignNew extends Component {
  state = {
    petDamage: '',
    petMagic: '',
    petEndurance: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      loading: true,
      errorMessage: '',
    });

    const accounts = await web3.eth.getAccounts();
    try {
      await token.methods
        .mint(
          this.state.petDamage,
          this.state.petMagic,
          this.state.petEndurance
        )
        .send({
          from: accounts[0],
        });

      message.success('Successfully create new pet!', 1);
      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  renderInformationMessage() {
    if (this.state.loading) {
      return (
        <Message icon>
          <Icon name="circle notched" loading={this.state.loading} />
          <Message.Content>
            <Message.Header>This may take several seconds.</Message.Header>
            We're doing the transaction for you. Please wait!!!
          </Message.Content>
        </Message>
      );
    } else if (this.state.errorMessage != '') {
      return (
        <Message negative>
          <Message.Header>Opps</Message.Header>
          <p>{this.state.errorMessage}</p>
        </Message>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Layout>
        <Link route={`/`}>
          <a>
            <h4>
              <Icon name="arrow alternate circle left outline" />
              Back
            </h4>
          </a>
        </Link>
        <h3>Create a New Pet</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Damage</label>
            <Input
              value={this.state.petDamage}
              onChange={(event) =>
                this.setState({ petDamage: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Magic</label>
            <Input
              value={this.state.petMagic}
              onChange={(event) =>
                this.setState({ petMagic: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Endurance</label>
            <Input
              label="seconds"
              labelposition="right"
              value={this.state.petEndurance}
              onChange={(event) =>
                this.setState({ petEndurance: event.target.value })
              }
            />
          </Form.Field>
          {this.renderInformationMessage()}
          <Button disabled={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
