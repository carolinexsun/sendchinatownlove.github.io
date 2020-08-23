import React, { useState } from 'react';
import styled from 'styled-components';

import { PassportContainer, Title, SubTitle, Button, ErrorMessage, ExternalLink} from "./style";
import { EMAIL_REGEX } from '../../utilities/hooks/ModalPaymentContext/constants';

import CrawlInsta from './CrawlInsta.png';
import ScreenName from "./ScreenName";

interface Props {
  setCurrentScreenView: Function;
};

const socialMediaLinks = [
  {platform: 'facebook', url: 'https://www.facebook.com/Send-Chinatown-Love-100872288240891'},
  {platform: 'instagram', url: 'https://instagram.com/sendchinatownlove'},
  {platform: 'envelope', url: 'mailto:hello@sendchinatownlove.com'},
];

const Track = ({ setCurrentScreenView }: Props) => {
  const [email, setEmail] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  // TODO(Athena): Check error code validity --> send to BE first then process?
  // Follow up to see how this part works
  const [isTicketValid, setIsTicketValid] = useState(true);
  const [instagramHandle, setinstagramHandle] = useState('');

  return (
    <Container>
      <InputContainer className="trackScreen top">
        <Title color="#a8192e">PASSPORT TO CHINATOWN</Title>
        <SubTitle>
          Enter your ticket code to start accumulating rewards you can use in
          Chinatown
        </SubTitle>

        <Column>
          <Label htmlFor="email-input">Email Address</Label>
          <InputField
            name="email-input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            pattern={EMAIL_REGEX.source}
          />
          {!!email && !EMAIL_REGEX.test(email) && (
            <ErrorMessage>Please enter a valid email address.</ErrorMessage>
          )}
        </Column>

        <Column>
          <Label htmlFor="ticket-code">Ticket Code</Label>
          <InputField
            name="ticket-code"
            type="text"
            onChange={(e) => setTicketCode(e.target.value)}
            value={ticketCode}
          />

          {/* TODO: need to sync up to something to check error code validity */}
          {!isTicketValid && (
            <ErrorMessage>
              This is not a valid Ticket Code. Please check your ticket again
              and make sure you haven’t added this ticket before.
            </ErrorMessage>
          )}
        </Column>
        <Row>
          <SubTitle size="10px">
            To be entered into our weekly giveaway, share your food crawl
            pictures on Instagram and tag @sendchinatownlove{' '}
          </SubTitle>
          <img src={CrawlInsta} alt="social-media-logo" width="40px"></img>
        </Row>

        <Label htmlFor="instagram-handle">Instagram Handle (Optional)</Label>
        <InputField
          name="instagram-handle"
          type="text"
          onChange={(e) => setinstagramHandle(e.target.value)}
          value={instagramHandle}
        />
      </InputContainer>
      
      <InputContainer className="bottom">
        <Button
          value="track-screen-button"
          className="button--red-filled"
          disabled={!email || !ticketCode}
          onClick={() => setCurrentScreenView(ScreenName.Dashboard)}
        >
          Add Ticket
        </Button>        
      </InputContainer>

      {/* <Row>
        <ExternalLink>VIEW MAP</ExternalLink>
        <ExternalLink href="mailto:sendchinatownlove@gmail.com">
          Contact Us
        </ExternalLink>
        <LinksContainer>
          {
            socialMediaLinks.map((social) => (
              <Icon href={social.url} key={social.url}>
                <span className={`fa fa-${social.platform}`} />
              </Icon>
            ))
          }
        </LinksContainer>
      </Row> */}
    </Container>
  );
};

export default Track;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  width: 367px;
  margin: 0 auto;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #dedede;
  padding: 25px 20px;
  box-sizing: border-box;
  overflow:hidden;
  width:100%;
  margin: 0 auto;

  &.trackScreen {
    padding-top: 60px;
  }

  &.top {
    border-radius: 20px 20px 0px 0px;
    border-bottom: 1px dashed #dedede;
  }

  &.bottom {
    padding-top: 25px;
    border-radius: 0px 0px 20px 20px;
    border-top: 1px dashed #dedede;
  }
`;

const Label = styled.label`
  font-size: 13px;
`;

const Column = styled.div`
  margin: 25px 0;
`; 

const InputField = styled.input`
  width: 100%;
  height: 45px;
  border: 1px solid #dadada;
  margin-top: 8px;
  padding-left: 1em;
  border-radius: 5px;

  :invalid {
    border: 1px solid red;
  }
`;

// FOOTER
export const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
`;

const LinksContainer = styled.div`
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
`;

const Icon = styled.a`
  text-decoration: none;
  color: #a8192e;
  padding: 0 15px;
  font-size: 22px;
`;