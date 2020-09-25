<template>
    <div class="error-toast">
        <slot class="content"></slot>
    </div>
</template>

<style lang="scss" scoped>
    .error-toast {
        position: fixed;
        z-index: 9;
        left: 50%;
        top: 50%;
        margin-left: -90px;
        margin-top: -20px;
        background-color: #ff6d69;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: solid 1px rgba(255, 255, 255, 0.3);
        box-shadow: 0 15px 15px -10px rgba(0, 0, 0, 0.8);
        width: 180px;
        text-align: center;
    }
</style>
