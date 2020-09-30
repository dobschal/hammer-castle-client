<template>
    <div class="date-view">{{parsedString}}</div>
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
                const timeString = `${this.twoDigits(d.getHours())}:${this.twoDigits(d.getMinutes())}`;
                if (Date.now() - this.timestamp < this.twentyFourHours) {
                    return timeString;
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
