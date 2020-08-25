makeDraggable('draggable-element', 'drag-area');

function makeDraggable(elementId, dragAreaId) {
    const positionMargin = 3;
    const positionMarginBottom = 50;

    let oldEventPositionX = 0;
    let oldEventPositionY = 0;

    document.addEventListener('mousedown', dragMouseDown);

    let element = null;
    let elementWidth = 0;

    function dragMouseDown(event) {
        element = document.getElementById(elementId);
        elementWidth = element.clientWidth;

        if (!event.target.matches('#drag-area')) return;

        event = event || window.event;
        event.preventDefault();
        
        oldEventPositionX = event.clientX;
        oldEventPositionY = event.clientY;

        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', releaseDrag);
    }

    function limit(min, value, max) {
        return Math.max(min, Math.min(value, max));
    }

    function elementDrag(event) {
        const documentWidth = document.documentElement.clientWidth;
        const documentHeight = document.documentElement.clientHeight;

        event = event || window.event;
        event.preventDefault();

        const maxLeftPosition = documentWidth - elementWidth - positionMargin;
        const maxTopPosition = documentHeight - positionMarginBottom;
        const minLeftPosition = positionMargin;
        const minTopPosition = positionMargin;

        const deltaX = oldEventPositionX - event.clientX;
        const deltaY = oldEventPositionY - event.clientY;

        oldEventPositionX = event.clientX;
        oldEventPositionY = event.clientY;

        const nextLeft = limit(minLeftPosition, element.offsetLeft - deltaX, maxLeftPosition);
        const nextTop = limit(minTopPosition, element.offsetTop - deltaY, maxTopPosition);

        element.style.top = `${nextTop}px`;
        element.style.left = `${nextLeft}px`;
    }

    function releaseDrag() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', releaseDrag);
    }
}
