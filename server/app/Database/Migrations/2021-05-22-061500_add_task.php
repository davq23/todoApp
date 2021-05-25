<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTask extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'tsk_id' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
                'auto_increment'    => true,
            ],
            
            'tsk_name' => [
                'type'              => 'VARCHAR',
                'constraint'        => 50,
            ],
            
            'tsk_description' => [
                'type'              => 'VARCHAR',
                'constraint'        => 255,
                'null'              => true,
            ],

            'tsk_user' => [
                'type'              => 'BIGINT',
                'constraint'        => 20,
                'unsigned'          => true,
            ],

            'tsk_created_at datetime default current_timestamp',
            'tsk_updated_at datetime default current_timestamp on update current_timestamp',
        ]);

        $this->forge->addPrimaryKey('tsk_id');
        $this->forge->addUniqueKey('tsk_name');
        $this->forge->addForeignKey('tsk_user', 'e_user', 'u_id', 'CASCADE', 'CASCADE');

        $this->forge->createTable('e_task');
    }

    public function down()
    {
        $this->forge->dropTable('e_task');
    }
}