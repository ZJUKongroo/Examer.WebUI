<template>
    <div class="sidebar-footer">
        <v-btn variant="plain" href="/terms-of-use">
            <v-icon left>mdi-file-document</v-icon>
            Terms of Use
            <v-icon>mdi-open</v-icon>
        </v-btn>
        <v-btn variant="plain" href="/open-source-license">
            <v-icon left>mdi-license</v-icon>
            License
            <v-icon>mdi-open</v-icon>
        </v-btn>
        <v-btn variant="plain" href="/about">
            <v-icon left>mdi-information</v-icon>
            About
            <v-icon>mdi-open</v-icon>
        </v-btn>
    </div>
</template>

<style scoped>
.sidebar-footer {
    padding: 16px;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.sidebar-footer .v-btn{
    width: fit-content;
}

.sidebar-footer-text-center {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
