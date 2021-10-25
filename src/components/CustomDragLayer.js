import { useDragLayer } from 'react-dnd';
import { ItemTypes } from '../Utils/items';
import { PageCardDragPreview } from './PageCardDragPreview';

function CustomDragLayer (props){
    const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    const layerStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    };
    function renderItem() {
        switch (itemType) {
            case ItemTypes.PAGECARD:
                return <PageCardDragPreview title={item.title}/>;
            default:
                return null;
        }
    }
    function getItemStyles(initialOffset, currentOffset) {
        if (!initialOffset || !currentOffset) {
            return {
                display: 'none',
            };
        }
        let { x, y } = currentOffset;
        const transform = `translate(${x}px, ${y}px)`;
        return {
            transform,
            WebkitTransform: transform,
        };
    }
    if (!isDragging) {
        return null;
    }
    return (<div style={layerStyles}>
			<div style={getItemStyles(initialOffset, currentOffset)}>
				{renderItem()}
			</div>
		</div>);
};

export default CustomDragLayer;
