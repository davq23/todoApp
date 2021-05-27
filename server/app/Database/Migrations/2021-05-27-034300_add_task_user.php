<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTaskUser extends Migration
{
    public function up()
    {
        $fields = [
            'tsk_u_done' => [
                'type'              => 'TINYINT',
                'constraint'        => 1,
                'unsigned'          => true,
                'default'           => '0',
            ],

            'tsk_u_updated_at datetime default current_timestamp'
        ];

        $this->forge->addColumn('r_task_user', $fields);

        $this->forge->addKey('tsk_u_updated_at');
        $this->forge->addKey('tsk_u_created_at');
    }

    public function down()
    {
        $this->forge->dropTable('r_task_user');
    }
}
