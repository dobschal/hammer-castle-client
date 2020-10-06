export default {
    install(Vue) {
        Vue.prototype.$util = {

            /**
             * @param {{ x: number, y: number }} positionA
             * @param {{ x: number, y: number }} positionB
             * @return {number}
             */
            positionDistance(positionA, positionB) {
                return Math.floor(Math.sqrt(Math.pow(positionB.x - positionA.x, 2) + Math.pow(positionB.y - positionA.y, 2)));
            },

            /**
             * @param {string} color
             * @param {number} percent
             * @return {string}
             */
            shadeColor(color, percent) {

                let R = parseInt(color.substring(1, 3), 16);
                let G = parseInt(color.substring(3, 5), 16);
                let B = parseInt(color.substring(5, 7), 16);

                R = Math.floor(R * percent);
                G = Math.floor(G * percent);
                B = Math.floor(B * percent);

                R = (R < 255) ? R : 255;
                G = (G < 255) ? G : 255;
                B = (B < 255) ? B : 255;

                let RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
                let GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
                let BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

                return "#" + RR + GG + BB;
            },

            /**
             * Get a random UUID
             * @return {string}
             */
            createRandomId() {
                let dt = new Date().getTime();
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            },

            setUrlParam(key, value) {
                const params = new URLSearchParams(location.search);
                params.set(key, value);
                window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
            },

            getUrlParam(key) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(key);
            },

            deleteUrlParam() {
                window.history.replaceState({}, '', `${location.pathname}`);
            }
        };
    }
};
