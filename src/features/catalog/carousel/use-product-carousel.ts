import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 48rem)";

export function useProductCarousel(itemCount: number, enabled: boolean) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [activePage, setActivePage] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const productsPerPage = isDesktop ? 3 : 1;
    const pageCount = Math.ceil(itemCount / productsPerPage);
    const dragStateRef = useRef<{
        pointerId: number;
        startX: number;
        startScrollLeft: number;
        moved: boolean;
    } | null>(null);
    const touchGestureRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        startScrollLeft: number;
        startPage: number;
        isHorizontal: boolean;
        interruptedSettle: boolean;
    } | null>(null);
    const suppressTouchClickRef = useRef(false);
    const touchSettleFrameRef = useRef<number | null>(null);
    const settlingPageRef = useRef<number | null>(null);

    useEffect(() => {
        const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const updateViewport = () => setIsDesktop(desktopQuery.matches);

        updateViewport();
        desktopQuery.addEventListener("change", updateViewport);

        return () => desktopQuery.removeEventListener("change", updateViewport);
    }, []);

    useEffect(() => {
        if (enabled) return;

        const viewport = viewportRef.current;
        const pointerId =
            dragStateRef.current?.pointerId ?? touchGestureRef.current?.pointerId;

        if (
            viewport &&
            pointerId !== undefined &&
            viewport.hasPointerCapture(pointerId)
        ) {
            viewport.releasePointerCapture(pointerId);
        }

        dragStateRef.current = null;
        touchGestureRef.current = null;
    }, [enabled]);

    useEffect(() => {
        const indicators = indicatorRef.current;
        const activeIndicator = indicatorRef.current?.querySelector<HTMLElement>(
            `[data-page="${activePage}"]`,
        );

        if (!indicators || !activeIndicator) return;

        const indicatorsRect = indicators.getBoundingClientRect();
        const activeIndicatorRect = activeIndicator.getBoundingClientRect();
        let targetScrollLeft = indicators.scrollLeft;

        if (activeIndicatorRect.left < indicatorsRect.left) {
            targetScrollLeft += activeIndicatorRect.left - indicatorsRect.left;
        } else if (activeIndicatorRect.right > indicatorsRect.right) {
            targetScrollLeft += activeIndicatorRect.right - indicatorsRect.right;
        } else {
            return;
        }

        indicators.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }, [activePage]);

    function scrollToPage(pageIndex: number) {
        const targetLeft = getPageScrollLeft(pageIndex);
        const viewport = viewportRef.current;

        if (!viewport || targetLeft === null) return;

        viewport.scrollTo({ left: targetLeft, behavior: "smooth" });
    }

    function getPageScrollLeft(pageIndex: number) {
        const viewport = viewportRef.current;

        if (!viewport) return null;

        const cards = viewport.querySelectorAll<HTMLElement>(":scope > article");
        const targetCard = cards[pageIndex * productsPerPage];

        if (!targetCard) return null;

        const targetLeft =
            viewport.scrollLeft +
            targetCard.getBoundingClientRect().left -
            viewport.getBoundingClientRect().left;
        const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

        return Math.max(0, Math.min(targetLeft, maxScrollLeft));
    }

    function animateTouchSettle(pageIndex: number) {
        const viewport = viewportRef.current;
        const targetLeft = getPageScrollLeft(pageIndex);

        if (!viewport || targetLeft === null) {
            setIsDragging(false);
            return;
        }

        const finalLeft = targetLeft;

        if (touchSettleFrameRef.current !== null) {
            cancelAnimationFrame(touchSettleFrameRef.current);
        }

        settlingPageRef.current = pageIndex;
        const startLeft = viewport.scrollLeft;
        const distance = finalLeft - startLeft;

        if (
            Math.abs(distance) < 1 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            viewport.scrollLeft = finalLeft;
            touchSettleFrameRef.current = null;
            settlingPageRef.current = null;
            setIsDragging(false);
            return;
        }

        const duration = 240;
        let startTime: number | null = null;

        function animateFrame(time: number) {
            if (startTime === null) startTime = time;

            const progress = Math.min(1, (time - startTime) / duration);
            const easedProgress = 1 - (1 - progress) ** 3;
            viewport!.scrollLeft = startLeft + distance * easedProgress;

            if (progress < 1) {
                touchSettleFrameRef.current = requestAnimationFrame(animateFrame);
                return;
            }

            viewport!.scrollLeft = finalLeft;
            touchSettleFrameRef.current = null;
            settlingPageRef.current = null;
            setIsDragging(false);
        }

        touchSettleFrameRef.current = requestAnimationFrame(animateFrame);
    }

    function updateActivePage() {
        const viewport = viewportRef.current;

        if (!viewport) return;

        const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

        if (maxScrollLeft <= 1) {
            setActivePage(0);
            return;
        }

        if (viewport.scrollLeft >= maxScrollLeft - 2) {
            setActivePage(pageCount - 1);
            return;
        }

        const viewportLeft = viewport.getBoundingClientRect().left;
        const cards = Array.from(
            viewport.querySelectorAll<HTMLElement>(":scope > article"),
        );
        const firstVisibleCardIndex = cards.findIndex(
            (card) => card.getBoundingClientRect().right > viewportLeft + 1,
        );

        setActivePage(
            firstVisibleCardIndex < 0
                ? 0
                : Math.floor(firstVisibleCardIndex / productsPerPage),
        );
    }

    function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (!enabled) return;

        if (!isDesktop && event.pointerType === "touch") {
            const viewport = viewportRef.current;

            if (!viewport || pageCount <= 1) return;

            const interruptedSettle = touchSettleFrameRef.current !== null;
            const startPage = interruptedSettle
                ? settlingPageRef.current ?? activePage
                : activePage;

            if (interruptedSettle) {
                cancelAnimationFrame(touchSettleFrameRef.current!);
                touchSettleFrameRef.current = null;
                setIsDragging(true);
            }

            touchGestureRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                startScrollLeft: viewport.scrollLeft,
                startPage,
                isHorizontal: false,
                interruptedSettle,
            };
            return;
        }

        if (!isDesktop || event.pointerType !== "mouse" || event.button !== 0) {
            return;
        }

        const target = event.target;

        if (
            target instanceof Element &&
            target.closest("a, button, input, select, textarea, [role='button']")
        ) {
            return;
        }

        const viewport = viewportRef.current;

        if (!viewport || viewport.scrollWidth <= viewport.clientWidth) return;

        dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: viewport.scrollLeft,
            moved: false,
        };
        setIsDragging(true);
        viewport.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (!enabled) return;

        const touchGesture = touchGestureRef.current;
        const viewport = viewportRef.current;

        if (
            touchGesture &&
            viewport &&
            touchGesture.pointerId === event.pointerId
        ) {
            const deltaX = event.clientX - touchGesture.startX;
            const deltaY = event.clientY - touchGesture.startY;

            if (
                !touchGesture.isHorizontal &&
                Math.abs(deltaX) > 8 &&
                Math.abs(deltaX) > Math.abs(deltaY) * 1.2
            ) {
                touchGesture.isHorizontal = true;
                setIsDragging(true);
                viewport.setPointerCapture(event.pointerId);
            }

            if (touchGesture.isHorizontal) {
                viewport.scrollLeft = touchGesture.startScrollLeft - deltaX;
            }

            return;
        }

        const dragState = dragStateRef.current;
        const mouseViewport = viewportRef.current;

        if (!dragState || !mouseViewport || dragState.pointerId !== event.pointerId) {
            return;
        }

        const distance = event.clientX - dragState.startX;

        if (Math.abs(distance) > 4) dragState.moved = true;

        if (dragState.moved) {
            mouseViewport.scrollLeft = dragState.startScrollLeft - distance;
        }
    }

    function finishPointerDrag(event: ReactPointerEvent<HTMLDivElement>) {
        if (!enabled) return;

        const touchGesture = touchGestureRef.current;

        if (touchGesture?.pointerId === event.pointerId) {
            touchGestureRef.current = null;
            const viewport = viewportRef.current;

            if (viewport?.hasPointerCapture(event.pointerId)) {
                viewport.releasePointerCapture(event.pointerId);
            }

            if (!viewport) return;

            if (!touchGesture.isHorizontal) {
                if (touchGesture.interruptedSettle) {
                    animateTouchSettle(touchGesture.startPage);
                }
                return;
            }

            const deltaX = event.clientX - touchGesture.startX;
            const threshold = Math.min(72, viewport.clientWidth * 0.18);
            const pageChange =
                Math.abs(deltaX) >= threshold ? (deltaX < 0 ? 1 : -1) : 0;
            const nextPage = Math.max(
                0,
                Math.min(pageCount - 1, touchGesture.startPage + pageChange),
            );

            suppressTouchClickRef.current = true;
            window.setTimeout(() => {
                suppressTouchClickRef.current = false;
            }, 0);

            animateTouchSettle(nextPage);
            return;
        }

        const dragState = dragStateRef.current;

        if (!dragState || dragState.pointerId !== event.pointerId) return;

        dragStateRef.current = null;
        setIsDragging(false);

        if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
            viewportRef.current.releasePointerCapture(event.pointerId);
        }

        if (dragState.moved) {
            const viewport = viewportRef.current;

            if (!viewport) return;

            let nearestPage = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;

            for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
                const pageLeft = getPageScrollLeft(pageIndex);

                if (pageLeft === null) continue;

                const distance = Math.abs(pageLeft - viewport.scrollLeft);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestPage = pageIndex;
                }
            }

            requestAnimationFrame(() => scrollToPage(nearestPage));
        }
    }

    function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
        if (!suppressTouchClickRef.current) return;

        suppressTouchClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
    }

    return {
        viewportRef,
        indicatorRef,
        activePage,
        pageCount,
        isDragging: enabled && isDragging,
        isDesktop,
        scrollToPage,
        updateActivePage,
        handlePointerDown,
        handlePointerMove,
        finishPointerDrag,
        handleClickCapture,
    };
}
