import React from 'react';
import { Menu, Icon, Button, Label } from 'semantic-ui-react';
import { Link } from '../routes';

// <Button content="CNT Coin" icon="bitcoin" basic color="green" />
const Header = () => {
  return (
    <Menu style={{ marginTop: '15px' }} inverted>
      <Menu.Item color="teal" active={true}>
        <Link route="/">
          <a>
            <Icon name="bitcoin" />
            CNTCoint
          </a>
        </Link>
      </Menu.Item>

      <Menu.Item position="right" color="olive" active={true}>
        <Link route="/">
          <a>PET COINS</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default Header;
