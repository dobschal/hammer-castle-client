<template>
    <span class="date-view">{{parsedString}}</span>
</template>

<script>
    export default {
        name: "DateView",
        data() {
            return {
                twentyFourHours: 1000 * 60 * 60 * 24
            };
        },
        props: {
            timestamp: Number // UTC
        },
        computed: {
            parsedString () {
                const d = new Date(this.timestamp);
                const now = new Date();
                const isYesterday = (now.getDate() - d.getDate() === 1 && now.getFullYear() === d.getFullYear() && d.getMonth() === now.getMonth());
                const timeString = `${this.twoDigits(d.getHours())}:${this.twoDigits(d.getMinutes())}`;
                if (!isYesterday && Date.now() - this.timestamp < this.twentyFourHours) {
                    return timeString;
                }
                if (isYesterday) {
                    return "Yesterday at " + timeString;
                }
                const dateString = `${d.getFullYear()}/${this.twoDigits(d.getMonth() + 1)}/${this.twoDigits(d.getDate())}`;
                return dateString + " " + timeString;
            }
        },
        methods: {
            twoDigits(num) {
                if (num < 10) {
                    return "0" + num;
                }
                return num + "";
            }
        }
    };
</script>
