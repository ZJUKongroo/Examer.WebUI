import { ref} from 'vue'
import { defineStore } from 'pinia'
import axios from '~/ts/request'
import type { Commit } from '~/types'
import Loki from 'lokijs'
import { ElMessage } from 'element-plus'

export const useCommitStore = defineStore('commit', () => {
    // state
    const loading = ref(false)
    const db = new Loki('commit')

    async function fetchCommits() {
        loading.value = true;
        try {
            const { data } = await axios.get<Commit[]>('/commit')

            // 如果集合不存在，则添加集合并插入数据
            let commitCollection = db.getCollection<Commit>('commits')
            if (!commitCollection) {
                commitCollection = db.addCollection<Commit>('commits')
            } else {
                // 重新加载数据前清空集合
                commitCollection.clear()
            }
            commitCollection.insert(data)
        } catch (e) {
            ElMessage.error("获取提交数据失败")
        } finally {
            loading.value = false
        }
    }

    async function queryExamCommit(examId: string, filters: { userName?: string, problemId?: string } = {}) {
        const commitCollection = db.getCollection<Commit>('commits')
        if (!commitCollection) {
            return []
        }

        const query: any = { 'exam': { '$eq': { 'id': examId } } }

        if (filters.userName) {
            query['user.name'] = { '$eq': filters.userName }
        }

        if (filters.problemId) {
            query['problem.id'] = { '$eq': filters.problemId }
        }

        return commitCollection.find(query)
    }


    return {
        loading,
        db,
        fetchCommits,
        queryExamCommit,
    }
})