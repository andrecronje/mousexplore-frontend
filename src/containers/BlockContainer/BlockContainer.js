import React, { PureComponent } from 'react';
import Block from 'components/Block/Block';
import NotFound from 'components/NotFound/NotFound';
import { connectSettings, formatBlockData } from 'core';

class BlockContainer extends PureComponent { 
  state = {
    block: undefined
  };

  componentDidMount() {
    this._isMounted = true;

    const { apiObject, currency, match } = this.props;

    const { blockHash } = match.params;

    if (blockHash) {
      this.getBlock(apiObject, currency, blockHash);    
    }
  }

  componentWillReceiveProps(newProps) {
    const { apiObject, currency, match } = newProps;

    const { blockHash } = match.params;

    if (blockHash) {
      this.getBlock(apiObject, currency, blockHash);    
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBlock(apiObject, currency, blockHash) {
    this.setState({
      block: undefined
    });

    apiObject.get(`/block/${blockHash}`)
      .then(res => {
        if (res.data.status !== 200) {
          return;
        }
        let block = res.data.data;

        block = formatBlockData(block, currency);

        if (this._isMounted)
          this.setState({ block: block });
      })
  }
  
  render () {
    const { currency } = this.props;
    const { block } = this.state;
    
    return (
      <div className="block-container">
        {
          block ? (
            <Block
              currency={currency}
              block={block}
            />
          ) : (
            <NotFound/>
          )
        }
        
      </div>
    );
  }
}

const mapStateToProps = ({settings}) => ({
  currency: settings.currency,
  apiObject: settings.apiObject
});

export default connectSettings(mapStateToProps, {})(BlockContainer);