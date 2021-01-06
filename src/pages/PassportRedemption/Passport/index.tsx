import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { CardContainer, TitleRow, Title, SubTitle, Button } from '../style';
import { MAILTO_URL } from '../../../consts';
import {
  getPassportTickets,
  getParticipatingSeller,
  getContactInfo,
} from '../../../utilities/api/interactionManager';

import TicketRow from './TicketRow';
import FAQ from './Faq';

import CircleLogo from '../Assets/CircleLogo.png';
import Coin1 from "../Assets/Coins/Coin1.png";

interface Props {
  setCurrentScreenView: Function;
}

const Passport = (props: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { push, location } = useHistory();
  const [showFaq, setShowFaq] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (location.hash === '#faq') {
      setShowFaq(true);
    } else {
      setShowFaq(false);
    }
  }, [location]);

  useEffect(() => {
    if (id) {
      getContactInfo(id)
        .then((contactInfo) => {
          return getPassportTickets(id);
        })
        .then((ticketIds) => {
          let promises: any[] = [];
          ticketIds.data.forEach((ticket) => {
            promises.push(
              getParticipatingSeller(ticket.participating_seller_id).then(
                (seller) => ({
                  stamp_url: seller.data.stamp_url,
                  ...ticket,
                })
              )
            );
          });

          return Promise.all(promises);
        })
        .then((passportTickets) => {
          if (passportTickets.length > 0) {
            setTickets(passportTickets);
          }
        })
        .catch((err) => {
          console.log('passport error: ' + err);
        });
    }
  }, [id]);

  const createTicketRows = (tickets) => {
    let rows: any[] = [];

    if (tickets.length > 0) {
      // make a temp ticket that sorts the tickets by sponsor seller, then redemption date
      let tempTickets = [...tickets];

      // push the stamps to rows of 3, if there arent 3, then push the left over amount
      while (tempTickets.length) {
        rows.push(tempTickets.splice(0, 3));
      }
    }

    // if there are less than 6 rows, make 6 rows, other wise make one extra row
    if (rows.length < 6) {
      while (rows.length < 6) {
        rows.push([]);
      }
    } else {
      rows.push([]);
    }

    return rows;
  };

  const createRows = (stamps) => {
    const rows = createTicketRows(stamps);
    return (
      <TableContainer>
        <Table>
          <tbody>
            {rows.map((row, index) => (
              <TicketRow
                stamps={row}
                index={index}
                key={index}
              />
            ))}
          </tbody>
        </Table>
      </TableContainer>
    );
  };

  const addTicket = (e) => {
    e.preventDefault();
    push('/passport');
  };

  return (
    <Container>
      <HeaderContainer>
        <RedirectionLinks
          href="https://www.sendchinatownlove.com/food-crawl.html"
          target="_blank"
        >
          {t('passport.headers.learn')}
        </RedirectionLinks>
        <Logo src={CircleLogo} alt="scl-log" />
        <RedirectionLinks href={MAILTO_URL}>
          {t('passport.headers.contact')}
        </RedirectionLinks>
      </HeaderContainer>
      <BodyContainer>
        <FAQ
          showFaq={showFaq}
          toggleView={() => push(location.pathname + '#faq')}
        />
        <PassportContainer
          mainView={!showFaq}
          onClick={() => push(location.pathname)}
        >
          <TitleRow>
            <Title color={showFaq ? 'rgba(255, 255, 255, 0.7)' : 'rgb(248,186,23,1)'}>
              {t('passport.headers.passport').toUpperCase()}
            </Title>
            {showFaq ? (
              <>
                <br />
                <br />
                <br />
              </>
            ) : (
              <>
                <SubHeader color={showFaq ? 'transparent' : 'white'}>
                  {t('passport.labels.daysLeft', {daysLeft: 25})} 
                </SubHeader> 
              </>
            )}
          </TitleRow>

          {showPopup && (
            <SendEmailContainer>
              <PassportIcon src={Coin1} />
              <TitleRow>
                <Title>{t('passport.headers.giveAwayEntryGoal', {tier: 1}).toUpperCase()}</Title>
                <SubTitle bold="700">
                  {t('passport.labels.merchantsVisited', {merchantsVisited: 3})}
                  <br />
                  <br />
                  {t('passport.labels.thankYou')}
                </SubTitle>
              </TitleRow>
              <SendEmailButtonClose
                className="button--red-filled"
                onClick={(e) => setShowPopup(false)}
              >
                {t('passport.placeholders.close')}
              </SendEmailButtonClose>
            </SendEmailContainer>
          )}
          {!showFaq && createRows(tickets)}
        </PassportContainer>
      </BodyContainer>
      {!showFaq && (
        <AddNewTicket className="button--filled" onClick={addTicket}>
          {t('passport.placeholders.addNewTicket')}
        </AddNewTicket>
      )}
    </Container>
  );
};

export default Passport;

const Container = styled.div`
  position: relative;
  width: 375px;
  hidden: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const PassportContainer = styled(CardContainer)`
  background-size: 400px;
  max-height: 650px;
`;

const SubHeader = styled(SubTitle)`
  font-style: italic;
  font-weight: bold;
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 12px auto;
`;
const RedirectionLinks = styled.a`
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  letter-spacing: 0.15em;
  font-size: 12px;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 0mm 2px #cdcdcd);
`;

const BodyContainer = styled.div`
  width: 375px;
  position: relative;
  display: flex;
  justify-content: center;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  height: calc(100vh - 300px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 12px;
`;

const AddNewTicket = styled(Button)`
  position: fixed;
  margin-left: -150px;
  bottom: 0;
  left: 50%;
  width: 300px;
  z-index: 100;
  font-weight: bold;
`;

const SendEmailContainer = styled.div`
  padding: 10px;
  position: absolute;
  width: 340px;
  margin: 0 auto;
  height: 467px;
  z-index: 20;
  top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  background: #f2eae8;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  border-radius: 5px;
`;

const PassportIcon = styled.img`
  width: 193px;
  height: 190px;
`;

const SendEmailButtonClose = styled(Button)`
  padding: 0;
  text-align: center;
  height: 32px;
  width: 115px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;
