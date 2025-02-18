<template>
    <div class="container" id="license-container">
        <h1 class="mb-4 license-anime-element">ACEE 试题提交系统</h1>
        <p class="mb-2 license-anime-element">By ZJUKongroo 工作室</p>
        <h2 class="mb-2 license-anime-element">Developers 开发者</h2>
        <div  class="colbox license-anime-element">
            <div class="developer-card colbox">
                <img src="@/assets/img/developer-avatar/daimolean.jpg" class="developer-card-avatar">
                <div class="developer-card-info">
                    <div class="colbox">
                        <div class="developer-card-name">
                            daimolean
                        </div>
                        <div class="developer-card-job">
                            后端
                        </div>
                    </div>
                    <div class="developer-card-email">
                        daimolean@zju.edu.cn
                    </div>
                </div>
            </div>
            <div class="developer-card colbox">
                <img src="@/assets/img/developer-avatar/cast1e.jpg" class="developer-card-avatar">
                <div class="developer-card-info">
                    <div class="colbox">
                        <div class="developer-card-name">
                            cast1e
                        </div>
                        <div class="developer-card-job">
                            前端
                        </div>
                    </div>
                    <div class="developer-card-email">
                        rooger@zju.edu.cn
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-2 license-anime-element">
            <v-alert variant="tonal" show-icon :closable="false" type="info">
                开发者能力有限，如果遇到 Bug 请联系开发者修复
            </v-alert>
        </div>
        <h2 class="mb-4 license-anime-element">使用的开源项目及协议</h2>
        <div id="project-card-container" class="license-anime-element">
            <div class="project-card" v-for="project in usedProjects" :key="project.name"
                @click="open(project.licenseUrl)">
                <div class="project-card-name">{{ project.name }}</div>
                <div class="project-card-license">{{ project.license }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import anime from 'animejs';
import { ref, onMounted } from 'vue'
onMounted(() => {
    anime({
        targets: ".license-anime-element",
        opacity: [0, 1],
        translateX: [20, 0],
        delay: anime.stagger(50),
    })
})
interface Project {
    name: string,
    license: string,
    licenseUrl: string,
}

function open(url: string) {
    window.open(url, "_blank");
}

const usedProjects = ref<Project[]>([{
    name: "aspnetcore",
    license: "MIT",
    licenseUrl: "https://github.com/dotnet/aspnetcore?tab=MIT-1-ov-file"
},
{
    name: "AutoMapper",
    license: "MIT",
    licenseUrl: "https://github.com/AutoMapper/AutoMapper?tab=MIT-1-ov-file#readme"
},
{
    name: "Swashbuckle.AspNetCore",
    license: "MIT",
    licenseUrl: "https://github.com/domaindrivendev/Swashbuckle.AspNetCore?tab=MIT-1-ov-file#readme"
},
{
    name: "vue",
    license: "MIT",
    licenseUrl: "https://github.com/vuejs/vue?tab=MIT-1-ov-file#readme"
}, {
    name: "TypeScript",
    license: "Apache-2.0 license",
    licenseUrl: "https://github.com/microsoft/TypeScript?tab=Apache-2.0-1-ov-file#readme"
},
{
    name: "element-plus",
    license: "MIT",
    licenseUrl: "https://github.com/element-plus/element-plus?tab=MIT-1-ov-file#readme"
},
{
    name: "vue-router",
    license: "MIT",
    licenseUrl: "https://github.com/vuejs/vue-router?tab=MIT-1-ov-file#readme"
},
{
    name: "marked",
    license: "MIT",
    licenseUrl: "https://github.com/markedjs/marked?tab=License-1-ov-file#readme"
},
{
    name: "sqlite",
    license: "Public domain",
    licenseUrl: "https://github.com/sqlite/sqlite?tab=License-1-ov-file#readme"
}])
</script>

<style>
#license-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 40px 100px 40px;
    overflow: hidden auto;
}

.developer-card {
    border: 1px solid var(--bd-color);
    width: fit-content;
    height: 120px;
    padding: 20px 30px 20px 30px;
    border-radius: 10px;
    background-color: var(--bg-color-solid);
    margin-right: 20px;
    margin-bottom: 20px;
    box-sizing: content-box;
}

.developer-card .developer-card-avatar {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    align-self: center;
    margin-right: 20px;
}

.developer-card .developer-card-info {
    align-self: center;
}

.developer-card .developer-card-name {
    font-size: 35px;
    margin-bottom: 5px;
    margin-right: 8px;
}

#project-card-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}

.project-card {
    border: 1px solid var(--bd-color);
    width: fit-content;
    height: 80px;
    padding: 20px 30px 20px 30px;
    border-radius: 10px;
    background-color: var(--bg-color-solid);
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: .3s;
    box-sizing: content-box;
}

.project-card:hover {
    background-color: var(--bg-color-alter);
}

.project-card:active {
    background-color: var(--bg-color);
}

.project-card-name {
    font-size: 30px;
    margin-bottom: 5px;
}

.project-card-license {
    font-size: 16px;
}
</style>