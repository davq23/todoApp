<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTaskUser extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'tsk_u_id' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
                'auto_increment'    => true,
            ],
            
            'tsk_u_user' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
            ],

            'tsk_u_task' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
            ],
            'tsk_u_done' => [
                'type'              => 'TINYINT',
                'constraint'        => 1,
                'unsigned'          => true,
                'default'           => '0',
            ],

            'tsk_u_created_at datetime default current_timestamp',
            'tsk_u_updated_at datetime default current_timestamp'
        ]);

        $this->forge->addPrimaryKey('tsk_u_id');

        $this->forge->addForeignKey('tsk_u_user', 'e_user', 'u_id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('tsk_u_task', 'e_task', 'tsk_id', 'CASCADE', 'CASCADE');

        $this->forge->addKey('tsk_u_created_at');
        $this->forge->addKey('tsk_u_updated_at');

        $this->forge->createTable('r_task_user');
    }

    public function down()
    {
        $this->forge->dropTable('r_task_user');
    }
}
