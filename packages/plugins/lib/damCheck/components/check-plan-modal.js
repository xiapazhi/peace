import React, { useRef } from 'react';
import { Button } from 'antd';
import {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormDateTimePicker,
    ProFormDependency,
} from '@ant-design/pro-form';
import moment from 'moment';
export default function TunnelModal(props) {
    const {
        title,
        triggerRender,
        editData = null,
        onFinish,
        checkitems,
        readOnly,
        myStructList,
        structUsers,
        structChange
    } = props;
    const fromRef = useRef();
    const initialValues = editData
        ? {
            ...editData,
            content: editData.content.split(',').map(s => parseInt(s))
        } : {};

    return (
        <ModalForm
            title={title || ''}
            initialValues={initialValues}
            formRef={fromRef}
            trigger={
                triggerRender
                || (
                    <Button type="primary" ghost>
                        {title || ''}
                    </Button>
                )
            }
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => { },
            }}
            onFinish={async (values) => {
                onFinish && (await onFinish(values, editData));
                return true;
            }}
        >
            <ProFormSelect
                options={myStructList.map((s) => ({ label: s.name, value: s.id }))}
                width="lg"
                name="structId"
                label="结构物名称"
                rules={[{ required: true, message: '结构物名称不能为空' }]}
                onChange={(e) => {
                    const form = fromRef.current;
                    form.setFieldsValue({ userId: null })
                    structChange(e)
                }}
                disabled={readOnly}
            />
            <ProFormSelect
                options={[{ id: '日常巡检', name: '日常巡检' }].map((s) => ({ label: s.name, value: s.id }))}
                width="lg"
                name="way"
                label="巡检方式"
                rules={[{ required: true, message: '巡检方式不能为空' }]}
                disabled={readOnly}
            />

            <ProFormSelect
                options={[
                    { id: '1天一次', name: '1天一次' },
                    { id: '3天一次', name: '3天一次' },
                    { id: '7天一次', name: '7天一次' }].map((s) => ({ label: s.name, value: s.id }))}
                width="lg"
                name="frequency"
                label="巡检频次"
                rules={[{ required: true, message: '巡检频次不能为空' }]}
                disabled={readOnly}
            />
            <ProFormSelect
                options={structUsers.map((s) => ({ label: s.name, value: s.id }))}
                width="lg"
                name="userId"
                label="巡检员"
                rules={[{ required: true, message: '巡检员不能为空' }]}
                disabled={readOnly}
            />
            <ProFormSelect
                options={checkitems.map((s) => ({ label: s.name, value: s.id }))}
                width="lg"
                name="content"
                label="巡检内容"
                fieldProps={{ mode: 'multiple' }}
                rules={[{ required: true, message: '巡检内容不能为空' }]}
                disabled={readOnly}
            />
            <ProFormDateTimePicker
                name="start"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间!' }]}
                fieldProps={{
                    format: 'YYYY-MM-DD HH:mm:ss',
                }}
                disabled={readOnly}
            />
            <ProFormDependency name={['start']}>
                {({ start }) => (
                    <ProFormDateTimePicker
                        name="end"
                        label="结束时间"
                        rules={[
                            { required: true, message: '请选择开始时间!' },
                            {
                                validator: async (rule, value) => {
                                    if (start && start !== '' && moment(value) < moment(start)) {
                                        return Promise.reject('结束时间不能小于开始时间');
                                    }
                                    Promise.resolve();
                                },
                            }]}
                        fieldProps={{
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }}
                        disabled={readOnly}
                    />

                )}
            </ProFormDependency>

        </ModalForm>
    );
}
