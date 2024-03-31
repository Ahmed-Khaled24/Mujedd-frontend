import { motion } from 'framer-motion';
import styled from 'styled-components';

export const PageContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    height: 100vh;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    gap: 1.7rem;
`;
export const UpgradeTitle = styled.h1`
    font-style: normal;
    font-weight: 600;
    font-size: 48px;
    line-height: 100%;
    display: flex;
    width: 28rem;
    align-items: center;
    text-align: center;
    letter-spacing: -0.04em;
    color: #343a40;
`;
export const ButtonsHolder = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 11px;

    width: 238px;
    height: 64px;

    background: #ffffff;
    box-shadow: var(--gray-shadow);
    border-radius: 25px;
`;
export const CardsHolder = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 17px;
    gap: 25px;
    @media (max-width: 868px) {
        flex-direction: column;
    }
`;

export const CardHolder = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 25px;
    align-items: left;
    position: relative;
    justify-content: space-between;
    box-sizing: border-box;
    width: 280px;
    height: 380px;
    background: #ffffff;
    border: 1.5px solid rgba(82, 82, 82, 0.27);
    box-shadow: var(--gray-shadow);
    border-radius: 5px;
    & > div:first-child {
        gap: 6px;

        display: flex;
        flex-direction: column;
    }
    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
    }
    p {
        color: var(--slate-500);
    }

    @media (min-height: 700px) {
        height: 430px;
        width: 300px;
    }
`;
export const UpgradeButton = styled.button`
    width: 100%;
    color: black;
    outline: none;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
`;
