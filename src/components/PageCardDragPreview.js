import { useEffect, useState, memo } from 'react';
import { PageCard } from './PageCard';
const styles = {
    display: 'inline-block',
    transform: 'rotate(-7deg)',
    WebkitTransform: 'rotate(-7deg)',
};
export const PageCardDragPreview = memo(function PageCardDragPreview({ title }) {
    const [tickTock, setTickTock] = useState(false);
    useEffect(function subscribeToIntervalTick() {
        const interval = setInterval(() => setTickTock(!tickTock), 500);
        return () => clearInterval(interval);
    }, [tickTock]);
    return (<div style={styles}>
				<PageCard title={title} yellow={tickTock} preview/>
			</div>);
});