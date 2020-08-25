# Make Draggable Object!

<div class="holder" style="height: 250px;">
    <div id="draggable-element1" class="popup">
        <div id="drag-area1" class="popup-header">
            Popup 1
        </div>
        <div>
            <strong>This is demo popup</strong>
            <li>Draggable</li>
            <li>NOT Resizable</li>
        </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div id="draggable-element2" class="popup">
        <div id="drag-area2" class="popup-header">
            Popup 2
        </div>
        <div>
            <strong>This is demo</strong>
            <li>Draggable</li>
            <li>Resizable</li>
        </div>
    </div>
</div>

``` css
.resizable {
    position: fixed;
    --resizer-weight: 3px;
}

.resizable .resizer {
    width: calc(var(--resizer-weight) * 2);
    height: calc(var(--resizer-weight) * 2);
    background: white;
    border: 1px solid #4286f4;
    background: unset;
    border: unset;
    position: absolute;
}
.resizable .resizer.top-left {
    z-index: 1;
    border-radius: 50%;
    width: calc(var(--resizer-weight) * 4);
    height: calc(var(--resizer-weight) * 4);
    left: calc(var(--resizer-weight) * -2);
    top: calc(var(--resizer-weight) * -2);
    cursor: nwse-resize;
}
.resizable .resizer.top-right {
    z-index: 1;
    border-radius: 50%;
    width: calc(var(--resizer-weight) * 4);
    height: calc(var(--resizer-weight) * 4);
    right: calc(var(--resizer-weight) * -2);;
    top: calc(var(--resizer-weight) * -2);
    cursor: nesw-resize;
}
.resizable .resizer.bottom-left {
    z-index: 1;
    border-radius: 50%;
    width: calc(var(--resizer-weight) * 4);
    height: calc(var(--resizer-weight) * 4);
    left: calc(var(--resizer-weight) * -2);
    bottom: calc(var(--resizer-weight) * -2);
    cursor: nesw-resize;
}
.resizable .resizer.bottom-right {
    z-index: 1;
    border-radius: 50%;
    width: calc(var(--resizer-weight) * 4);
    height: calc(var(--resizer-weight) * 4);
    right: calc(var(--resizer-weight) * -2);
    bottom: calc(var(--resizer-weight) * -2);
    cursor: nwse-resize;
}
.resizable .resizer.bottom {
    left: calc(var(--resizer-weight) - 1px);
    width: calc(100% - (var(--resizer-weight) - 1px) * 2);
    bottom: calc(var(--resizer-weight) * -1);
    cursor: ns-resize;
}
.resizable .resizer.top {
    left: calc(var(--resizer-weight) - 1px);
    width: calc(100% - (var(--resizer-weight) - 1px) * 2);
    top: calc(var(--resizer-weight) * -1);
    cursor: ns-resize;
}
.resizable .resizer.left {
    top: calc(var(--resizer-weight) - 1px);
    height: calc(100% - (var(--resizer-weight) - 1px) * 2);
    left: calc(var(--resizer-weight) * -1);
    cursor: ew-resize;
}
.resizable .resizer.right {
    top: calc(var(--resizer-weight) - 1px);
    height: calc(100% - (var(--resizer-weight) - 1px) * 2);
    right: calc(var(--resizer-weight) * -1);
    cursor: ew-resize;
}
```

<script>
class Popup {
    static builder(elementQuery) {
        class Builder {
            constructor(elementQuery) {
                this.elementQuery = elementQuery;
                this.isDraggable = false;
                this.isResizable = false;
                this.positionMargin = 4;
                this.minimumWidth = 10;
                this.minimumHeight = 10;

                return this;
            }

            draggable(dragAreaQuery = null) {
                this.dragAreaQuery = dragAreaQuery ? dragAreaQuery : this.elementQuery;
                this.isDraggable = true;
                return this;
            }

            resizable(value = true) {
                this.isResizable = value;
                return this;
            }
            minimumSize(width, height) {
                this.minimumWidth = width;
                this.minimumHeight = height;
                return this;
            }

            setPositionMargin(value) {
                this.positionMargin = value;
                return this;
            }

            build() {
                return new Popup(this);
            }
        }

        return new Builder(elementQuery);
    }

    static #popupId = 0;
    static get #nextId() {
        this.#popupId += 1;
        return this.#popupId;
    }

    static #limit(min, value, max) {
        if (min === -1) {
            return Math.min(value, max);
        } else if (max === -1) {
            return Math.max(value, max);
        } else {
            return Math.max(min, Math.min(value, max));
        }
    }

    get #resizerDirections() {
        return [
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'bottom',
            'top',
            'left',
            'right',
        ];
    }
    set #elementWidth(value) {
        this.element.style.width = `${value}px`;
    }
    set #elementHeight(value) {
        this.element.style.height = `${value}px`;
    }
    set #elementLeft(value) {
        this.element.style.left = `${value}px`;
    }
    set #elementTop(value) {
        this.element.style.top = `${value}px`;
    }

    constructor(builder) {
        if (!builder) return;

        this.elementQuery = builder.elementQuery;
        this.element = document.querySelector(this.elementQuery);
        this.dragAreaQuery = builder.dragAreaQuery ? builder.dragAreaQuery : builder.elementQuery;
        this.draggable = builder.isDraggable;
        this.resizable = builder.isResizable;
        this.positionMargin = builder.positionMargin;
        
        this.minimumWidth = builder.minimumWidth || 55;
        this.minimumHeight = builder.minimumHeight || 55;

        this.oldEventPositionX = 0;
        this.oldEventPositionY = 0;

        if (this.draggable) {
            document.addEventListener('mousedown', (event) => {
                this.element = document.querySelector(this.elementQuery);
                if (!this.element) return;

                if (!event.target.closest(this.dragAreaQuery)) return;

                this.elementWidth = this.element.clientWidth;
                this.elementHeight = this.element.clientHeight;

                event = event || window.event;
                event.preventDefault();
                
                this.oldEventPositionX = event.clientX;
                this.oldEventPositionY = event.clientY;

                document.addEventListener('mousemove', this.elementDrag);
                document.addEventListener('mouseup', this.releaseDrag);

                return true;
            });
        }

        if (this.resizable) {
            this.element = document.querySelector(this.elementQuery);
            if (!this.element) return;
            
            this.element.classList.add('resizable');
            
            const id = Popup.#nextId;
            
            for (const resizerDirection of this.#resizerDirections) {
                const resizerElement = document.createElement('span');
                resizerElement.id = `resizer-${resizerDirection}-${id}`;
                resizerElement.classList.add('resizer');
                resizerElement.classList.add(resizerDirection);
                this.element.appendChild(resizerElement);
            }
            
            const resizers = document.querySelectorAll(`${this.elementQuery} .resizer`);
            
            for (const resizer of resizers) {
                document.addEventListener('mousedown', (event) => {
                    this.element = document.querySelector(this.elementQuery);
                    if (!this.element) return;
                    if (!event.target.matches(`#${resizer.id}`)) return;

                    event = event || window.event;
                    event.preventDefault();

                    this.elementWidth = parseFloat(
                        getComputedStyle(this.element, null)
                        .getPropertyValue('width')
                        .replace('px', ''));
                    this.elementHeight = parseFloat(
                        getComputedStyle(this.element, null)
                        .getPropertyValue('height')
                        .replace('px', ''));

                    this.elementLeft = this.element.getBoundingClientRect().left;
                    this.elementTop = this.element.getBoundingClientRect().top;

                    this.oldEventPositionX = event.pageX;
                    this.oldEventPositionY = event.pageY;

                    document.addEventListener('mousemove', resize);
                    document.addEventListener('mouseup', stopResize);
                });

                const resize = (event) => {
                    event = event || window.event;
                    event.preventDefault();
                    

                    const minimumWidth = 20;
                    if (resizer.classList.contains('bottom-right')) {
                        const width = this.elementWidth + (event.pageX - this.oldEventPositionX);
                        const height = this.elementHeight + (event.pageY - this.oldEventPositionY);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                        };
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                        };
                    } else if (resizer.classList.contains('bottom-left')) {
                        const height = this.elementHeight + (event.pageY - this.oldEventPositionY);
                        const width = this.elementWidth - (event.pageX - this.oldEventPositionX);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                            this.#elementLeft = this.elementLeft + (event.pageX - this.oldEventPositionX);
                        }
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                        }
                    } else if (resizer.classList.contains('top-right')) {
                        const width = this.elementWidth + (event.pageX - this.oldEventPositionX);
                        const height = this.elementHeight - (event.pageY - this.oldEventPositionY);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                        }
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                            this.#elementTop = this.elementTop + (event.pageY - this.oldEventPositionY);
                        }
                    } else if (resizer.classList.contains('top-left')) {
                        const width = this.elementWidth - (event.pageX - this.oldEventPositionX);
                        const height = this.elementHeight - (event.pageY - this.oldEventPositionY);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                            this.#elementLeft = this.elementLeft + (event.pageX - this.oldEventPositionX);
                        }
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                            this.#elementTop = this.elementTop + (event.pageY - this.oldEventPositionY);
                        }
                    } else if (resizer.classList.contains('left')) {
                        const width = this.elementWidth - (event.pageX - this.oldEventPositionX);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                            this.#elementLeft = this.elementLeft + (event.pageX - this.oldEventPositionX);
                        }
                    } else if (resizer.classList.contains('right')) {
                        const width = this.elementWidth + (event.pageX - this.oldEventPositionX);
                        if (width > this.minimumWidth) {
                            this.#elementWidth = width;
                        }
                    }  else if (resizer.classList.contains('top')) {
                        const height = this.elementHeight - (event.pageY - this.oldEventPositionY);
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                            this.#elementTop = this.elementTop + (event.pageY - this.oldEventPositionY);
                        }
                    } else if (resizer.classList.contains('bottom')) {
                        const height = this.elementHeight + (event.pageY - this.oldEventPositionY);
                        if (height > this.minimumHeight) {
                            this.#elementHeight = height;
                        }
                    } 
                }

                const stopResize = () => {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                }
            }
        }

    }

    elementDrag = (event) => {
        const documentWidth = document.documentElement.clientWidth;
        const documentHeight = document.documentElement.scrollHeight;

        event = event || window.event;
        event.preventDefault();

        const maxLeftPosition = documentWidth - this.elementWidth - this.positionMargin;
        const maxTopPosition = documentHeight - this.elementHeight - this.positionMargin;
        const minLeftPosition = this.positionMargin;
        const minTopPosition = this.positionMargin;

        const deltaX = this.oldEventPositionX - event.clientX;
        const deltaY = this.oldEventPositionY - event.clientY;

        this.oldEventPositionX = event.clientX;
        this.oldEventPositionY = event.clientY;

        this.#elementLeft = Popup.#limit(minLeftPosition, this.element.offsetLeft - deltaX, maxLeftPosition);
        this.#elementTop = Popup.#limit(minTopPosition, this.element.offsetTop - deltaY, maxTopPosition);
    }

    releaseDrag = () => {
        document.removeEventListener('mousemove', this.elementDrag);
        document.removeEventListener('mouseup', this.releaseDrag);
    }
}

const drag1 = Popup.builder('#draggable-element1').draggable('#drag-area1').build();
const drag2 = Popup.builder('#draggable-element2').draggable('#drag-area2').resizable().minimumSize(200, 80).build();

</script>
