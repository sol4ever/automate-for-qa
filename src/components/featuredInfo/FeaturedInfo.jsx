import './featuredInfo.css';
import React, { useState } from 'react';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import MonthlyDataModal from '../monthlyDataModal/MonthlyDataModal';

export default function FeaturedInfo() {

    const NEW_USERS_AMOUNT_CURRENT_MONTH = 240;
    const NEW_USERS_AMOUNT_PREVIOUS_MONTH_CHANGE = 11;

    const SALES_CURRENT_MONTH = 183415; // w PLN
    const SALES_PREVIOUS_MONTH_CHANGE = 150; // w PLN

    const COSTS_CURRENT_MONTH = 94150; // w PLN
    const COSTS_PREVIOUS_MONTH_CHANGE = -3400; // w PLN



    const [modalData, setModalData] = useState(null);

    const handleOpenModal = (type) => {
        let header, data;
    
        switch (type) {
            case 'newUsersAmount':
                header = 'Wykonane zlecenia';
                data = generateMonthlyData(NEW_USERS_AMOUNT_CURRENT_MONTH, NEW_USERS_AMOUNT_PREVIOUS_MONTH_CHANGE);
                break;
            case 'sales':
                header = 'Przychód';
                data = generateMonthlyData(SALES_CURRENT_MONTH, SALES_PREVIOUS_MONTH_CHANGE);
                break;
            case 'costs':
                header = 'Koszty';
                data = generateMonthlyData(COSTS_CURRENT_MONTH, COSTS_PREVIOUS_MONTH_CHANGE);
                break;
            default:
                return;
        }
    
        setModalData({ header, data });
    };
    
    const handleCloseModal = () => {
        setModalData(null);
    };

    const generateMonthlyData = (currentValue, change) => {
        const data = [];
        const currentMonthIndex = new Date().getMonth(); 
        const currentMonthValue = Math.round(currentValue);

        // Obliczenie wartości poprzedniego miesiąca na podstawie zmiany
        const previousMonthValue = Math.round(currentValue + change);
    
        const monthNames = [
            'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 
            'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
        ];
    
        // Dodaj bieżący miesiąc
        data.push({ month: monthNames[currentMonthIndex], value: currentMonthValue });
    
        // Dodaj poprzedni miesiąc
        const previousMonthIndex = (currentMonthIndex === 0) ? 11 : currentMonthIndex - 1;
        data.push({ month: monthNames[previousMonthIndex], value: previousMonthValue });
    
        // Dodaj pozostałe miesiące
        for (let i = 2; i <= 3; i++) {
            const randomValue = Math.floor(Math.random() * 500) + 100;
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            data.push({ month: monthNames[monthIndex], value: randomValue });
        }
    
        return data;
    };
    

    return (
        <div className='featured'>
            <div className='featuredItem' data-testid='newUsersAmount' onClick={() => handleOpenModal('newUsersAmount')}>
                <span className='featuredTitle'>Wykonane zlecenia</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney" data-testid='newUsersAmount-currentMonth'>{NEW_USERS_AMOUNT_CURRENT_MONTH}</span>
                    <span className="featuredMoneyRate" data-testid='newUsersAmount-previousMonth'>-{NEW_USERS_AMOUNT_PREVIOUS_MONTH_CHANGE}<ArrowDownward className='featuredIcon negative' />
                    </span>
                </div>
                <span className='featuredSub'> W stosunku do poprzeniego miesiąca</span>
            </div>
            <div className='featuredItem' data-testid='sales' onClick={() => handleOpenModal('sales')}>
                <span className='featuredTitle'>Przychód</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney" data-testid='sales-currentMonth'>{SALES_CURRENT_MONTH} PLN</span>
                    <span className="featuredMoneyRate" data-testid='sales-previousMonth'>-{SALES_PREVIOUS_MONTH_CHANGE} PLN<ArrowDownward className='featuredIcon negative' />
                    </span>
                </div>
                <span className='featuredSub'> W stosunku do poprzeniego miesiąca</span>
            </div>
            <div className='featuredItem' data-testid='costs' onClick={() => handleOpenModal('costs')}>
                <span className='featuredTitle'>Koszty</span>
                <div className="featuredMoneyContainer">
                    <span className="featuredMoney" data-testid='costs-currentMonth'>{COSTS_CURRENT_MONTH} PLN</span>
                    <span className="featuredMoneyRate" data-testid='costs-previousMonth'>+{COSTS_PREVIOUS_MONTH_CHANGE*(-1)} PLN<ArrowUpward className='featuredIcon' />
                    </span>
                </div>
                <span className='featuredSub'> W stosunku do poprzeniego miesiąca</span>
            </div>
            {modalData && (
                <MonthlyDataModal
                    open={Boolean(modalData)}
                    onClose={handleCloseModal}
                    header={modalData.header}
                    data={modalData.data}
                />
            )}
        </div>
    )
}
