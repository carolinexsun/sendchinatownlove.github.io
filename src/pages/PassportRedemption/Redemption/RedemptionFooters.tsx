import React from 'react';

import { SubTitle, Button } from '../style';

export const NoRewardsFooter = () => {
  return (
    <>
      <SubTitle bold="700">Have more tickets to add?</SubTitle>

      <Button
        value="redemption-selected-button"
        className="button--red-filled"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/passport';
        }}
      >
        ADD NEW TICKETS
      </Button>
    </>
  );
};

interface RedeemRewardsProps {
  id: number;
  access_token: string;
  selectedSponsor: null | any;
}

export const RedeemRewardsFooter = (props: RedeemRewardsProps) => {
  return (
    <>
      <SubTitle bold="700">
        When redeemed, you have 5 minutes to use your reward.
      </SubTitle>

      <Button
        value="redemption-selected-button"
        className="button--red-filled"
        disabled={!props.selectedSponsor}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/passport/${props.id}/redeem/${props.access_token}/sponsor/${props.selectedSponsor.id}`;
        }}
      >
        REDEEM NOW
      </Button>
    </>
  );
};

interface defaultProps {
  allSponsors: any[];
  id: number;
}

export const DefaultFooter = (props: defaultProps) => {
  return (
    <>
      <SubTitle bold="700">
        Select an offer and be ready to show this screen when you’re ordering.
      </SubTitle>

      {props.allSponsors.length <= 4 && (
        <Button
          className="linkButton"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/passport/${props.id}/tickets`;
          }}
        >
          RETURN TO PASSPORT
        </Button>
      )}
    </>
  );
};
