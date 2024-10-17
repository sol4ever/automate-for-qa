import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import './analytics.css';
import WidgetLg from '../../components/widgetLg/widgetLg';
import WidgetSm from '../../components/widgetSm/widgetSm';

export default function Analytics() {
    return (
        <div className='analytics'>
            <FeaturedInfo />
            <div className="analyticsWidgets">
                <WidgetSm />
                <WidgetLg />
            </div>
        </div>
    )
}
