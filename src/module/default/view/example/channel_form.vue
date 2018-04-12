<template>
  <div class="pageMain">
    <meta-form ref="form" :entity-name="entityName" :model="model"
               @exDataChanged="exDataChanged" @on-created="onCreated" @on-deleted="onDeleted">
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="title" v-model="model.title" title="频道名称">
        </meta-field>
        </Col>
      </Row>
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="status" v-model="model.status">
        </meta-field>
        </Col>
      </Row>
      <Row type="flex" :gutter="10">
        <Col span="24" order="1">
        <meta-field name="description" v-model="model.description">
        </meta-field>
        </Col>
      </Row>
    </meta-form>
  </div>
</template>
<script>
  export default {
    mixins:[mvueCore.mixins.formBase]
  }
</script>

